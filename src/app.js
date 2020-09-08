const express = require('express')
const path = require('path')
const hbs = require('hbs')

const app = express()
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
//configuring partials below
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Anvitha Swarangi'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Anvitha Swarangi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Anvitha Swarangi',
        helpText: 'This is some helpful text.'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide a address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }
        forecast(latitude, longitude, (error, forecastdata) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            // console.log(location)
            // console.log(forecastdata)
            res.send({
                forecast: forecastdata,
                location,
                address: req.query.address
            })
        })
    })
    
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Anvitha Swarangi'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'Anvitha Swarangi'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})