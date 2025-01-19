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