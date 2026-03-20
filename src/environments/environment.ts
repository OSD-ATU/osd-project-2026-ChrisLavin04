export const environment = {
  production: false,
// Local API URL
//  apiUrl: 'http://localhost:3000'

// EC2 API URL. Elastic IP: 54.228.193.188
  apiUrl: 'https://ec2-54-228-193-188.eu-west-1.compute.amazonaws.com:3000',
  // AWS Lambda API URL for standings calculation
  standingsApiUrl: 'https://po703b7766.execute-api.eu-west-1.amazonaws.com/calculate-standings'

};
