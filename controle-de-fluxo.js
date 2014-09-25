// Exemplo de controle de fluxo
var Bluebird = require('bluebird');
var fs = require('fs');
var path = require('path');

// Começamos uma cadeia de promises
Bluebird.resolve().then(function(){

  console.log('Entramos na primeira promise da cadeia.');

  // A chave aqui é sempre lembrar de
  // sempre retornar uma promise no escopo
  // principal, para que a cadeia de promises
  // possa continuar normalmente

  // Criamos uma promise que ainda não foi resolvida
  var promise = Bluebird.pending();

  // Vamos usar o setTimeout para simular uma
  // operação assíncrona
  setTimeout(function(){

    // Para continuar a cadeia, precisamos resolver
    // esta promise ou rejeitar ela, neste exemplo
    // vamos resolver.
    promise.resolve();

  }, 2000);

  // Como comentado anteriormente, precisamos retornar
  // uma promise, neste caso retornaremos a promise
  // que ainda não está resolvida
  return promise.promise;

}).then(function(){

  console.log('Entramos na segunda promise da cadeia.');

  // Novamente criamos uma promise ainda não resolvida
  // para retorna-la e continuar a cadeia quando
  // a mesma for resolvida ou rejeitada
  var promise = Bluebird.pending();

  // Vamos usar o fs para simular um exemplo de I/O
  // assínsrono real
  fs.readdir(__dirname, function(err, files){

    // Se acontecer um erro, podemos rejeitar
    // a promise, passando o erro que ocorreu, este
    // return serve somente para não continuar executando o
    // código nas próximas linhas, se ocorrer um erro.
    if(err)
      return promise.reject(err);

    // Depois de ler os arquivos nesta pasta, vamos terminar
    // essa promise, marcando a mesma como resolvida e passando
    // uma array de arquivos encontrados para a próxima
    // promise na cadeia.
    promise.resolve(files);

  });

  // Retornamos a promise principal
  return promise.promise;

}).then(function(files){

  console.log('Entramos na terceira promise da cadeia.');

  // Quando não executamos nenhuma operação assíncrona
  // podemos apenas retornar qualquer valor, sem a necessidade
  // de criar uma promise. Este valor sera um parâmetro na próxima
  // promise da cadeia
  return files;
}).map(function(file, index){

  if(index === 0)
    console.log('Entramos na quarta promise da cadeia.');

  console.log('Buscando os atributos do arquivo %s', file);

  // Note que agora não usamos o .then, mas sim o .map. Esta função
  // serve para iterar de modo assíncrono sobre uma array ou uma array
  // de promises. Na promise anterior, enviamos uma array, então agora
  // vamos iterar sobre cada item, MAPeando um novo valor para esse index,
  // exatamente como o Array.prototype.map funciona, só que assincronamente
  var promise = Bluebird.pending();

  // Esse .resolve do path não tem nenhuma relação com a promise
  // é apenas um método do core do Node.js para concatenar um
  // caminho no sistema de arquivos :-)
  var caminho = path.resolve(__dirname, file);

  // Vamos buscar as propriedades
  fs.stat(caminho, function(err, stat){

    // Se um erro ocorrer, rejeitamos esta promise
    if(err)
      return promise.reject(err);

    // Tudo certo, substituimos a index desse loop
    // pelos atributos do arquivo atual, só vamos
    // adicionar o nome do arquivo para poder usar
    // na próxima promise da cadeia
    stat.name = file;
    promise.resolve(stat);

  });

  // Vamos fazer uma operação assíncrona, portanto precisamos
  // retornar a promise não resolvida que criamos anteriormente
  return promise.promise;

}).then(function(files){

  console.log('Entramos na quinta promise da cadeia.');

  // Quando o .map anterior acabar com todos os ítens, esta
  // promise irá executar.
  files.forEach(function(file){
    console.log('O arquivo %s tem um tamanho de %s bytes',
      file.name, file.size);
  });
}).catch(function(err){

  console.log('Entramos na sexta promise da cadeia.');

  // O .catch serve para pegar qualquer erro que acontecer
  // dentro das promises que estão acima na cadeia de promises.
  // Lembrando que quando rejeitamos uma promise com o .reject
  // ela também vai acionar diretamente este .catch
  console.log('Ocorreu um erro: %s', err.message);
  console.error(err.stack);

}).then(function(){
  console.log('Entramos na sétima promise da cadeia.');
  console.log('Espero que tenham gostado do tutorial :-)');
});
