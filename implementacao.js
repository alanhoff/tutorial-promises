// Neste tutorial vamos criar uma função que usa promises
// para que você possa utilizar em exemplos reais, para isso
// vamos utilizar o módulo request
var request = require('request');
var Bluebird = require('bluebird');

var lerPagina = function(url){

  // Criamos uma promise que ainda não
  // foi resolvida
  var promise = Bluebird.pending();

  // Vamos fazer uma operação assíncrona
  request(url, function(err, res, html){

    // Se ocorrer algum erro com a requisição
    // precisamos rejeitar esta promise
    if(err)
      return promise.reject(err);

    // Caso não exista um erro, resolvemos esta promise
    promise.resolve({
      res: res,
      html: html,
      url: url
    });

  });

  // retornamos a promise não resolvida para que possamos
  // criar uma cadeia de promises e/ou esperar pelo resultado
  // desta promise assincronamente
  return promise.promise;
};

// Agora basta testar essa função que criamos
lerPagina('http://google.com.br')

  // Assim que a prómise for resolvida pelo lerPagina, a próxima
  // função na cadeia de promises será executada, e receberá como
  // parâmetro o que foi passado para o promise.resolve
  .then(function(pagina){
    console.log('%s retornou status %s', pagina.url, pagina.res.statusCode);
  })

  // Podemos continuar a cadeia de promises utilizando a mesma função
  .then(lerPagina.bind(null, 'http://facebook.com'))
  .then(function(pagina){
    console.log('%s retornou status %s', pagina.url, pagina.res.statusCode);
  })

  // Utilizamos o .bind pois ele retorna uma função encapsulada
  // sem ela o .then não teria uma função para executar quando chegasse
  // a sua vez na cadeia de promises
  .then(lerPagina.bind(null, 'http://twitter.com'))
  .then(function(pagina){
    console.log('%s retornou status %s', pagina.url, pagina.res.statusCode);
  })

  // Caso algum erro aconteça em qualquer promise acima, este .catch
  // irá disparar
  .catch(function(err){
    console.log('Oh oohhh.. Ocorreu um erro: %s', err.message);
    console.error(err.stack);
  });
