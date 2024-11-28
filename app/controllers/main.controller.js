angular.module('meuApp')
    .controller('MainController', ['ApiService', function (ApiService) {
        var vm = this;

        // Dados iniciais
        vm.people = [];
        vm.errorMessage = '';

        // Controle de paginação 
        vm.currentPage = 1; // Página inicial
        vm.linesByPage = 3; // Quantidade de itens por página
        vm.totalPeople = 0; // Total de pessoas (atualizado ao carregar dados)

        // Função para carregar todas as pessoas
        vm.loadData = function() {
            ApiService.getAllPersons()
                .then(function(data) {
                    vm.people = data; // Atualiza os dados na view
                    vm.totalPeople = data.length; // Total de registros para paginação
                    vm.getPeoplePaginated();
                })
                .catch(function(error) {
                    vm.errorMessage = error.message || 'Erro ao carregar os dados.';
                });
        };

        // Chamada inicial para carregar os dados
        vm.loadData();
        
        // Função para obter as pessoas da página atual
        vm.getPeoplePaginated = function() {
            // Cálculo do índice inicial e final com base na página atual e itens por página
            var start = (vm.currentPage - 1) * vm.linesByPage;
            var end = start + vm.linesByPage;
            return vm.people.slice(start, end); // Retorna somente os registros da página atual
        };
        
        // Função chamada ao alterar o número de linhas por página
        vm.updateRowsPage = function() {
            vm.currentPage = 1; // Reseta para a primeira página
        };

        // Função para navegar entre as páginas
        vm.goToPage = function(pagina) {
            if (pagina > 0 && pagina <= Math.ceil(vm.totalPeople / vm.linesByPage)) {
                vm.currentPage = pagina;
            }
        };

        // Ações de exemplo
        vm.filter = function() {
            alert("Filtro aplicado!");
        };

        vm.newPerson = function() {
            alert("Nova pessoa adicionada!");
        };

        vm.openContacts = function(id) {
            alert("Abrindo contatos da pessoa com ID: " + id);
        };

        vm.viewPerson = function(id) {
            alert("Visualizando pessoa com ID: " + id);
        };

        vm.editPerson = function(id) {
            alert("Editando pessoa com ID: " + id);
        };

        vm.deletePerson = function(id) {
            alert("Deletando pessoa com ID: " + id);
        };

    }]);
