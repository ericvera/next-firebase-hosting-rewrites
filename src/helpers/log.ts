export default (message?: any, ...optionalParams: any[]) => {
  if (optionalParams.length > 0) {
    console.log('> [FHR]', message, optionalParams)
  } else {
    console.log('> [FHR]', message)
  }
}
