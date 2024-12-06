
angular.module('meuApp')
    .service('ApiService', ['$http', function ($http) {
        // this.getData = function () {
        //     console.log('->', $http.get('http://localhost:8000/api/person'))
        //     return $http.get('http://localhost:8000/api/person');
        // };

        var baseUrl = 'http://localhost:8000/api/person';
                    //   http://localhost:8000/api/person

        // Função para buscar todas as pessoas
        this.getAllPersons = function() {
            return $http.get(baseUrl)
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

        // Método para excluir uma pessoa por ID
        this.deletePerson = function (id) {
            return $http.delete(baseUrl + '/' + id).then(function (response) {
                return response.data; // Retorna a mensagem de sucesso
            });
        };

    }]);

