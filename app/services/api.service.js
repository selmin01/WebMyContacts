
angular.module('meuApp')
    .service('ApiService', ['$http', function ($http) {
        // this.getData = function () {
        //     console.log('->', $http.get('http://localhost:8000/api/person'))
        //     return $http.get('http://localhost:8000/api/person');
        // };

        var apiBaseUrl = 'http://localhost:8000/api/person';

        // Função para buscar todas as pessoas
        this.getAllPersons = function() {
            return $http.get(apiBaseUrl)
                .then(function(response) {
                    // Verifica se o sucesso está verdadeiro e retorna os dados
                    if (response.data.success) {
                        return response.data.data;
                    } else {
                        throw new Error(response.data.message || 'Erro ao buscar os dados.');
                    }
                })
                .catch(function(error) {
                    console.error('Erro na API:', error);
                    throw error;
                });
        };

    }]);

    // .service('PersonService', ['$http', function($http) {
        
    // }]);
