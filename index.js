const searchPageEl = document.querySelector('.main-div-search');
const displayPageEl = document.querySelector('.main-div-display');
const searchBarEl = document.querySelector('#country-name');
const searchButtonEl = document.querySelector('#search-button');
const suggestBox = document.querySelector('.autocomplete-div');
const errorDivEl = document.querySelector('.show-error-text');

const data_to_display_El = {
    flagImageEl: document.querySelector('.flag-img'),
    countryNameEl: document.querySelector('.country-name-text'),
    langSpokenEl: document.querySelector('.lang-spoken-text'),
    geoLocEl: document.querySelector('.geo-location-text'),
    mapsTextEl: document.querySelector('.maps-text')
}



let country_to_search;

const hovered = (el) => {
    const selectedData = el.textContent;
    searchBarEl.value = selectedData;
    suggestBox.classList.remove('active');
}

const displayAutoCompleteDiv = (list) => {
    let suggData;
    if (list.length != 0) {
        suggData = list.join(" ");
    }
    else {
        userValue = searchBarEl.value;
        suggData = `<li>${userValue}</li>`;
    }

    suggestBox.innerHTML = suggData;
}

searchBarEl.onkeyup = (event) => {
    let country_name = event.target.value;
    let autoArr = [];

    if (country_name) {
        autoArr = c_name_arr.filter((value) => {
            return value.toLocaleLowerCase().startsWith(country_name.toLocaleLowerCase());
        })
        autoArr = autoArr.map((value) => {
            return value = `<li>${value}</li>`;
        })
        // console.log(autoArr);
        suggestBox.classList.add('active');
        displayAutoCompleteDiv(autoArr);
        let allList = suggestBox.querySelectorAll('li');
        allList.forEach((value) => {
            value.setAttribute('onclick', 'hovered(this)');
        })
    }
    else {
        suggestBox.classList.remove('active');
    }
}

const getApiData = async (country) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        const objdata = await response.json();
        searchPageEl.style.display = 'none';
        displayPageEl.style.display = 'flex';
        console.log(objdata)
        let country_data_obj = {
            name: objdata[0].name.official,
            flag_img_url: objdata[0].flags.png,
            lang_spoken: [],
            latitude: objdata[0].latlng[0],
            longitude: objdata[0].latlng[1],
            maps_url: objdata[0].maps.googleMaps
        }
        for (const key in objdata[0].languages) {

            country_data_obj.lang_spoken = [...(country_data_obj.lang_spoken), objdata[0].languages[key]];
        }
        country_data_obj.lang_spoken = country_data_obj.lang_spoken.join(", ")
        console.log(country_data_obj);

        data_to_display_El.countryNameEl.innerHTML = `<span style="font-weight:900;">Country Name :-</span> ${country_data_obj.name}`;

        data_to_display_El.langSpokenEl.innerHTML = `<span style="font-weight:900;">Languages Spoken :-</span> ${country_data_obj.lang_spoken}`;

        data_to_display_El.geoLocEl.innerHTML = `<span style="font-weight:900;">Geographic Location :-</span> Latitude : ${country_data_obj.latitude}; Longitude : ${country_data_obj.longitude}`;

        data_to_display_El.flagImageEl.src = country_data_obj.flag_img_url;

        data_to_display_El.mapsTextEl.href = country_data_obj.maps_url;
    }
    catch (err) {
        console.log(err);
        errorDivEl.textContent = 'Oopps !! Looks Like we Forgot To Cover This Country ';
    }
}

searchButtonEl.onclick = (event) => {
    // console.log('clicked');
    // console.log(searchBarEl.value);
    country_to_search = searchBarEl.value;
    if(country_to_search !== null && country_to_search.trim().length !== 0)
    getApiData(country_to_search);
    else
    errorDivEl.textContent = 'Oopps !! Looks Like we Forgot To Cover This Country ';
}


