export function fetchGoogleApiData(query) {
  const request = {
    query: query,
    fields: []
  }

  const service = new window.google.maps.places.PlacesService(document.createElement('div'))
  
  service.textSearch(request, (data, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      console.log('Google API data: ', data)
      return data
    } else {
      console.error('Error fetching Google API data:', status)
    }
  })
}

export function fetchGoogleApiDataById(placeId) {
  const request = {
    placeId: placeId,
    fields: ['name', 'formatted_address', 'plus_code', 'rating', 'user_ratings_total', 'photos', 'opening_hours', 'place_id']
  }

  const map = new google.maps.Map(document.createElement('div'))
  const service = new window.google.maps.places.PlacesService(map)

  service.getDetails(request, (data, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      console.log('Google API data: ', data)
      return data
    } else {
      console.error('Error fetching Google API data:', status)
    }
  })
}
