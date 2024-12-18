
angular.module('meuApp')
    .service('ApiService', ['$http', function ($http) {
        // this.getData = function () {
        //     console.log('->', $http.get('http://localhost:8000/api/person'))
        //     return $http.get('http://localhost:8000/api/person');
        // };

        var baseUrlPerson = 'http://localhost:8000/api/person';

        // Função para buscar todas as pessoas
        this.getAllPersons = function() {
            return $http.get(baseUrlPerson)
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

        // Método para buscar uma pessoa pelo ID
        this.getPersonById = function (id) {
            return $http.get(baseUrlPerson + '/' + id).then(function (response) {
                return response.data; // Retorna os dados da resposta
            });
        };
        // Função para criar uma nova pessoa
        this.createPerson = function (data) {
            return $http.post(baseUrlPerson, data)
                .then(function (response) {
                    // Verifique se a resposta possui status HTTP 200 ou 201
                    if (response.status === 200 || response.status === 201) {
                        return response.data; // Retorna os dados da resposta
                    } else {
                        throw new Error(response.data.message || 'Erro ao criar a pessoa.');
                    }
                })
                .catch(function (error) {
                    console.error('Erro ao criar pessoa:', error);
                    throw error; // Rejeita a promise com o erro
                });
        };
        this.updatePerson = function (id, data) {
            return $http.put(baseUrlPerson + '/' + id, data).then(function (response) {
                // return response.data;
                    // Verifique se a resposta possui status HTTP 200 ou 201
                    if (response.status === 200 || response.status === 201) {
                        return response.data; // Retorna os dados da resposta
                    } else {
                        throw new Error(response.data.message || 'Erro ao criar a pessoa.');
                    }
                })
                .catch(function (error) {
                    console.error('Erro ao criar pessoa:', error);
                    throw error; // Rejeita a promise com o erro
                });
        };
        
        // Método para excluir uma pessoa por ID
        this.deletePerson = function (id) {
            return $http.delete(baseUrlPerson + '/' + id).then(function (response) {
                return response.data; // Retorna a mensagem de sucesso
            });
        };

        var baseUrlContact = 'http://localhost:8000/api/contact';

        this.createContact = function (contact) {
            return $http.post(baseUrlContact, contact)
                .then(function (response) {
                    // return response.data; // Retorna os dados da resposta
                    if (response.status === 200 || response.status === 201) {
                        return response.data; // Retorna os dados da resposta
                    } else if (response.status === 3003) {
                        throw new Error('Pessoa já cadastrada.'); // Mensagem específica para o status 3003
                    } else {
                        throw new Error(response.data.message || 'Erro ao criar a pessoa.<<'); // Mensagem padrão para outros erros
                    }
                })
                .catch(function (error) {
                    console.error('Erro ao criar contato:', error);
                    throw error; // Repassa o erro para o chamador
                });
        };

        this.getContactsByPersonId = function (personId) {
            return $http.get(baseUrlContact + '/all/' + personId)
                .then(function (response) {
                    return response.data; // Retorna os dados da resposta
                })
                .catch(function (error) {
                    console.error('Erro ao buscar contatos:', error);
                    throw error; // Lança o erro para ser tratado no controller
                });
        };

        this.deleteContact = function (id) {
            return $http.delete(baseUrlContact + '/' + id).then(function (response) {
                return response.data; // Retorna a mensagem de sucesso
            });
        };

    }]);

