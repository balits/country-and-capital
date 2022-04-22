function AjaxCountries() {
  // initiate
  let xhr = new XMLHttpRequest()
  // init request
  xhr.open('GET', 'https://restcountries.com/v3.1/all',true);
  
  let countries = undefined

  xhr.onload = function() {
    if (xhr.status == 200) {
      // create div for each country
      countries = JSON.parse(this.response);
      
      countries.forEach(elem => {
        const item = document.createElement('div')
        item.innerHTML = elem.capital
        
        document.getElementById('list').appendChild(item)
      })
    }
  }

  xhr.send();
  
  return countries;
}

// const root = 'https://restcountries.com/v3.1/all'
// let req = new Request(root, 'GET');

// fetch(req).then((response) => {
//             if (response.ok) {
//               // promise
//               return response.json();
//             } else {
//               throw new Error('BAD HTTP STATUS');
//             }
//           })
//           .then((data) => {
//             console.log(data);
//           })
//           .catch( (err) => {
//             console.log('ERROR: ' + err);
//           })