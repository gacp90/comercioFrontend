// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// DOMAINS
/**
  base_url: 'https://admin.comerciollanero.com/api',
  local_url: 'https://admin.comerciollanero.com',

  base_url: 'https://admin.shopybrands.com/api',
  local_url: 'https://admin.shopybrands.com',

  base_url: 'http://localhost:3000/api',
  local_url: 'http://localhost:4200',

  // ELKIN
  empresa: {
    name:'shopybrands.com',
    address:'Bogota - Colombia',
    nit:'000000000',
    email: 'elkindanielcastillo@gmail.com',
    phone: '+573155962626',
    facebook: 'https://www.facebook.com/shopybrands',
    instagram: 'https://www.instagram.com/shopybrands',
    tiktok: 'none',
    whatsapp: 'whatsapp://send?text=hola,+me+interesa+tus+productos&phone=+573155962626',
    logo: 'logo-shopy.webp',
    logob: 'logo-shopy-blanco.webp',
    ico: 'logo-shopy.webp',
    sizeico: '150'

  }

  // COMERCIO
  empresa: {
    name:'comercio llanero',
    address:'Yopal, Carrera 14A Nro #25-25 - Colombia',
    nit:'80.721.272',
    email: 'soporte@comerciollanero.com',
    phone: '+573044419848',
    facebook: 'https://www.facebook.com/comerciollanerocol',
    instagram: 'https://www.instagram.com/comerciollanero',
    tiktok: 'https://www.tiktok.com/@comercio_llanero',
    whatsapp: 'whatsapp://send?text=hola,+quiero+mas+informacion&phone=+573044419848',
    logo: 'logo.webp',
    logob: 'logo.webp',
    ico: 'ico.webp',
    sizeico: '60'
  }

*/

export const environment = {
  production: false,
  base_url: 'https://admin.shopybrands.com/api',
  local_url: 'https://admin.shopybrands.com',
  empresa: {
    name:'shopybrands.com',
    address:'Bogota - Colombia',
    nit:'000000000',
    email: 'elkindanielcastillo@gmail.com',
    phone: '+573155962626',
    facebook: 'https://www.facebook.com/shopybrands',
    instagram: 'https://www.instagram.com/shopybrands',
    tiktok: 'none',
    whatsapp: 'whatsapp://send?text=hola,+me+interesa+tus+productos&phone=+573155962626',
    logo: 'logo-shopy.webp',
    logob: 'logo-shopy-blanco.webp',
    ico: 'logo-shopy.webp',
    sizeico: '150'
  }
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
