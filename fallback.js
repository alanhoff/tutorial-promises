// Vamos demonstrar como implementar uma função que
// pode ser usada tanto com callbacks quanto com promise

var request = require('request');
var Bluebird = require('bluebird');

var lerPagina = function(url, callback){

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

  // Se não existir um callback quer dizer que o usuário
  // chamou esta função e está esperando uma promise,
  // assim retornamos a promise e acabou por aqui
  if(!callback)
    return promise.promise;

  // Caso exista um callback, precisamos esperar
  // a promise ser completada, e passamos o resultado
  // dela para o callback.
  promise.promise.then(function(pagina){
    callback(null, pagina);
  }).catch(function(err){

    // Se ocorrer um erro, chamamos o callback com o primeiro
    // parâmetro como sendo o erro
    callback(err);

  });
};

// Agora podemos usar a função com callbacks
lerPagina('http://google.com.br', function(err, pagina){
  if(err)
    throw err;

  console.log('Página como callback retornou status %s', pagina.res.statusCode);
});


// Ou com promises
lerPagina('http://facebook.com.br').then(function(pagina){
  console.log('Página como promise retornou status %s', pagina.res.statusCode);
}).catch(function(err){
  throw err;
});
