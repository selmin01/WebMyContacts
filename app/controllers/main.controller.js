
angular.module('meuApp')
    .controller('MainController', ['ApiService', function (ApiService) {
        var vm = this;

        // Dados iniciais
        // vm.dados = [];
        // vm.mensagemErro = '';

        // // Função para buscar dados
        // vm.carregarDados = function () {
        //     ApiService.getData()
        //         .then(function (response) {
        //             vm.dados = response.data;
        //         })
        //         .catch(function (error) {
        //             vm.mensagemErro = 'Erro ao carregar dados.';
        //             console.error(error);
        //         });
        // };

        vm.people = [];
        vm.errorMessage = '';

        // Função para carregar todas as pessoas
        vm.carregarDados = function() {
            ApiService.getAllPersons()
                .then(function(data) {
                    vm.people = data; // Atualiza os dados na view
                })
                .catch(function(error) {
                    vm.errorMessage = error.message || 'Erro ao carregar os dados.';
                });
        };

        // Chamada inicial
        vm.carregarDados();
    }]);
