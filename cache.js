// Neste tutorial vamos criar uma função que faz cache de promises
var request = require('request');
var Bluebird = require('bluebird');

// Criamos um objeto para guardar as URLs que já foram
// chamadas, assim não precisamos gastar banda sem necessidade
var cache = {};

var lerPagina = function(url){

  // Se a URL já existir no cache, retornamos essa promise
  // ao invés de criar uma nova
  if(cache[url])
    return cache[url];

  // Criamos uma promise que ainda não
  // foi resolvida
  var promise = Bluebird.pending();

  // Guardamos essa promise em nosso cache
  cache[url] = promise.promise;

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

  // Note que as próximas requisições para a mesma página ficaram
  // muito mais rápidas
  .then(lerPagina.bind(null, 'http://google.com.br'))
  .then(function(pagina){
    console.log('%s retornou status %s', pagina.url, pagina.res.statusCode);
  })

  // Utilizamos o .bind pois ele retorna uma função encapsulada
  // sem ela o .then não teria uma função para executar quando chegasse
  // a sua vez na cadeia de promises
  .then(lerPagina.bind(null, 'http://google.com.br'))
  .then(function(pagina){
    console.log('%s retornou status %s', pagina.url, pagina.res.statusCode);
  })

  // Caso algum erro aconteça em qualquer promise acima, este .catch
  // irá disparar
  .catch(function(err){
    console.log('Oh oohhh.. Ocorreu um erro: %s', err.message);
    console.error(err.stack);
  });
