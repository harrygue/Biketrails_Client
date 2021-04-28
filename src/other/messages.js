export const errorMessages = {
    sessionOut: 'Your session expired, please login again !',
    notAuthorized: 'User is not authorized! eventually you have to re-login!',
    generalError: 'Ups, something went wrong !',
    registerFailure: message => `Register not possible! Following error occured: ${message}`,
    loginFailure: message => `${message}! Please try again or just watch our nice pictures !`,
    // biketrails:
    renderFailure: message => `Something went wrong, cannot render the biketrail: ${message}`,
    createFailure: message => `Cannot create Biketrail! Following Error occurred: ${message}`,
    updateFailure: message => `Cannot update Biketrail! Following Error occurred: ${message}`,
    deleteFailure: message => `Cannot delete Biketrail! Following Error occurred: ${message}`,
}

export const successMessages = {
    loginOk: userName => `Hello ${userName}! Welcome back again !`,
    logoutOk: 'You logged out, see you next time !!!',
    registerOk: userName => `Hello ${userName}! Welcome as a new user !`,
    // biketrails:
    createBiketrailOk: name => `Biketrail ${name} successfully created`,
    updateBiketrailOk: name => `Biketrail ${name} successfully updated`,
    deleteBiketrailOk: id => `Biketrail ${id} successfully deleted`,
    createCommentOk: 'new comment created',
    updateCommentOk: 'Comment updated',
    deleteCommentOk: 'Comment deleted',
    addImageOk: 'Image added',
    deleteImageOk: 'Image deleted'
}