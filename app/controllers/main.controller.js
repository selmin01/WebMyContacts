angular.module('meuApp')
    .controller('MainController', ['$scope', 'ApiService', function ($scope, ApiService) {
        var vm = this;

        // Dados iniciais
        vm.people = [];
        vm.totalPeople = 0;
        vm.linesByPage = 5;
        vm.currentPage = 1;
        vm.startRow = 1;
        vm.endRow = vm.linesByPage;
        vm.errorMessage = '';

        // Função para abrir o modal
        vm.openNewPersonModal = function () {
            console.log('Abrindo modal...');
            var modalElement = document.getElementById('exampleModal');
            if (modalElement) {
                var myModal = new bootstrap.Modal(modalElement, {}); // Inicialize o modal sem opções extras
                myModal.show(); // Mostre o modal
            } else {
                console.error('Elemento modal não encontrado no DOM');
            }
        };

        vm.alerts = []; // Array para armazenar alertas
        // Função para adicionar um alerta
        vm.addAlert = function (type, message) {
            vm.alerts.push({ type: type, message: message });
        };
        // Função para remover um alerta
        vm.closeAlert = function (index) {
            vm.alerts.splice(index, 1); // Remove o alerta pelo índice
        };

        // Função para carregar todas as pessoas
        vm.loadData = function() {
            ApiService.getAllPersons()
                .then(function(data) {
                    vm.people = data; // Atualiza os dados na view
                    vm.totalPeople = data.length; // Total de registros para paginação
                    vm.getPeoplePaginated();
                    // vm.updateRowRange();
                })
                .catch(function(error) {
                    vm.errorMessage = error.message || 'Erro ao carregar os dados.';
                    vm.addAlert('danger', 'Erro ao carregar os dados: ' + vm.errorMessage);
                });
        };
        // Ouve o evento de atualização de dados
        $scope.$on('dataUpdated', function () {
            console.log('Evento recebido: dataUpdated');
            vm.loadData(); // Recarrega os dados
        });

        // Chamada inicial para carregar os dados
        vm.loadData();
        
        // Função para obter as pessoas da página atual
        vm.getPeoplePaginated = function () {
            var start = (vm.currentPage - 1) * vm.linesByPage; // Índice inicial
            var end = start + vm.linesByPage; // Índice final
            vm.peoplePaginated = vm.people.slice(start, end); // Atualiza apenas os registros da página atual
            vm.updateRowRange(); // Atualiza o intervalo visível
        };
        
        // Atualiza o intervalo de linhas exibidas
        vm.updateRowRange = function () {
            vm.startRow = (vm.currentPage - 1) * vm.linesByPage + 1;
            vm.endRow = Math.min(vm.currentPage * vm.linesByPage, vm.totalPeople);
        };
        // Alterar número de linhas por página
        vm.updateRowsPage = function () {
            vm.currentPage = 1; // Reseta para a primeira página
            vm.getPeoplePaginated();
        };
        // Função para navegar entre as páginas
        vm.goToPage = function (pagina) {
            if (pagina > 0 && pagina <= Math.ceil(vm.totalPeople / vm.linesByPage)) {
                vm.currentPage = pagina;
                vm.getPeoplePaginated();
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

        // Função para excluir uma pessoa
        vm.deletePerson = function (id) {
            if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
                ApiService.deletePerson(id)
                    .then(function (response) {
                        // alert(response.message || 'Pessoa excluída com sucesso!');
                        vm.addAlert('success', response.message || 'Pessoa excluída com sucesso!');

                        // Atualiza a lista local após a exclusão
                        vm.people = vm.people.filter(function (person) {
                            return person.id !== id;
                        });
                        vm.totalPeople = vm.people.length; // Atualiza o total
                    })
                    .catch(function (error) {
                        // alert('Erro ao excluir a pessoa.');
                        vm.addAlert('danger', 'Erro ao excluir a pessoa.');
                        console.error('Erro:', error);
                    });
            }
        };
    }]);
