//initial reference
const moves = document.getElementById( "moves" ) ;
const container = document.querySelector ( ".container" ) ;
const startButton = document.getElementById( "start-button" ) ;
const coverScreen = document.querySelector ( ".cover-screen" ) ;
const result = document.getElementById( "result" ) ;

let currentElement = "" ;
let movesCount,
    imagesArr = [];
const isTouchDevice = ( ) => {
    try{

    // We try to create TouchEvent ( it would
    //desktops ad throw error )
    document.createEvent( "TouchEvent" );
    return true;
}catch(e){
    return false
    }

};

//random number for image
const randomNumber = () => Math.floor( Math.random() * 8) + 1;



// Get row and column value from data - position
const getCoords = ( element ) => {
    const [ row , col ] = element.getAttribute
    ( "data-position" ).split( "_" );
    return [ parseInt( row ), parseInt( col )];
}; 

// rowl , coll are image co-ordinates while row2 amd
// col2 are blank image co-ordinates
const checkAdjacent = ( row1 , row2 , col1 , col2 ) =>
    { }; 
