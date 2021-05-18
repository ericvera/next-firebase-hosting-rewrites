export default (message?: any, ...optionalParams: any[]) => {
  if (optionalParams.length > 0) {
    console.error('> [FHR]', message, optionalParams)
  } else {
    console.error('> [FHR]', message)
  }
}
