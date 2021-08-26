import { LitElement, html, css } from 'lit'
import { resolvePromise } from './directive/resolve-promise.js'
import { AsyncWeather } from '@cicciosgamino/openweather-apis'

class OpenWeatherApisElement extends LitElement {
  static get styles () {
    return css`
      :host {
        display: block;    
      }
    `
  }

  static get properties () {
    return {
      lang: String,
      noui: Boolean,
      apikey: String,
      openweatherAPI: Object,
      id: String,
      city: String,
      lat: String,
      lon: String,
      zip: String,
      country: String,
      temp: Number,
      pres: Number,
      smart: Object
    }
  }

  constructor () {
    super()
    // init
    this.noui = false
  }

  firstUpdated () {
    new AsyncWeather()
      .then(w => {
        this.openweatherAPI = w
        // set the apikey
        this.openweatherAPI.setApiKey(this.apikey)
        // set language
        if (this.lang) {
          this.openweatherAPI.setLang(this.lang)
        }
        // set coordinates (latitude,longitude)
        if (this.lat && this.lon) {
          this.openweatherAPI.setCoordinates(this.lat, this.lon)
        }
        if (this.zip && this.country) {
          this.openweatherAPI.setZipCodeAndCountryCode(
            this.zip, this.country)
        }
        if (this.id) {
          this.openweatherAPI.setCityId(this.id)
        }
        if (this.city) {
          this.openweatherAPI.setCity(this.city)
        }
        // if set the smart attribute use the getSmarJSON
        if (this.smart) {
          this.openweatherAPI.getSmartJSON()
          .then(result => {
            this.smart = JSON.stringify(result)
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  updated (changed) {
    // listening for no user interface noui
    if (changed.has('noui')) {
      this.hasAttribute('noui') ? 
        this.noui = true : this.noui = false
    }
  }

  #uiTemplate () {
    return html`
      ${this.openweatherAPI
          ? resolvePromise(this.openweatherAPI.getTemperature())
          : '...'}°C - 
      ${this.openweatherAPI
          ? resolvePromise(this.openweatherAPI.getDescription())
          : '...'}
      <hr>
      ${this.openweatherAPI
        ? this.smart
        : '...'}
    `
  }

  render () {
    return html`
      ${this.noui
        ? html``
        : this.#uiTemplate()
      }`
  }
}

customElements.define('openweather-apis-element', OpenWeatherApisElement)
