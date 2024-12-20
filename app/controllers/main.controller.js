angular.module('meuApp')
    .controller('MainController', ['$scope', '$rootScope', 'ApiService', function ($scope, $rootScope, ApiService) {
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
            var modalElement = document.getElementById('NewContactModal');
            if (modalElement) {
                var myModal = new bootstrap.Modal(modalElement, {}); // Inicialize o modal sem opções extras
                myModal.show(); // Mostre o modal
            } else {
                console.error('Elemento modal não encontrado no DOM');
            }
        };

        // Função para abrir o modal de edição
        vm.openEditPersonModal = function (id, activeTab) {
            console.log('Abrindo modal de edição para ID:', id);
            // Emite o evento no $rootScope
            $rootScope.$emit('editPersonEvent', id);
            $rootScope.$emit('setActiveTab', activeTab);

            // Abre o modal
            var modalElement = document.getElementById('editModal');
            if (modalElement) {
                var myModal = new bootstrap.Modal(modalElement, {});
                myModal.show();
            } else {
                console.error('Modal de edição não encontrado no DOM');
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
                    vm.filteredPeople = data; // Inicializa os dados filtrados
                    vm.totalPeople = data.length; // Total de registros para paginação
                    vm.getPeoplePaginated(); // Inicializa a paginação
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
        // Escuta o evento indicando que os dados foram atualizados
        $rootScope.$on('dataCreateEvent', function () {
            console.log('Evento recebido: dados atualizados');
            vm.addAlert('success', 'Pessoa adicionada com sucesso!');
            vm.loadData(); // Recarrega os dados
        });
        $rootScope.$on('dataUpdatedEvent', function () {
            console.log('Evento recebido: dados atualizados');
            vm.addAlert('success', 'Edição concluída com sucesso!');
            vm.loadData(); // Recarrega os dados
        });

        // Chamada inicial para carregar os dados
        vm.loadData();

        vm.filteredPeople = vm.peoplePaginated; // Lista inicial

        // Estado do filtro
        vm.isFilterActive = false;
        vm.searchQuery = '';

        // Alterna o filtro
        vm.toggleFilter = function () {
            vm.isFilterActive = !vm.isFilterActive;

            if (!vm.isFilterActive) {
                vm.searchQuery = ''; // Limpa o campo de pesquisa
                vm.filteredPeople = vm.people; // Reseta os dados
            }
        };

        // Filtra os contatos
        vm.filterContacts = function () {
            if (!vm.searchQuery.trim()) {
                // Se o campo estiver vazio, reseta para todos os dados
                vm.filteredPeople = vm.people;
                vm.totalPeople = vm.filteredPeople.length;
                vm.currentPage = 1; // Reseta para a primeira página
                vm.getPeoplePaginated(); // Atualiza a paginação com todos os dados
                return;
            }
        
            // Filtra os contatos com base no texto digitado
            vm.filteredPeople = vm.people.filter(function (person) {
                return person.name.toLowerCase().includes(vm.searchQuery.toLowerCase()) ||
                       person.type.toLowerCase().includes(vm.searchQuery.toLowerCase());
            });
        
            // Atualiza os dados filtrados
            vm.totalPeople = vm.filteredPeople.length;
            vm.currentPage = 1; // Reseta para a primeira página
            vm.getPeoplePaginated();
        };
        
        // Função para obter as pessoas da página atual
        // vm.getPeoplePaginated = function () {
        //     var start = (vm.currentPage - 1) * vm.linesByPage; // Índice inicial
        //     var end = start + vm.linesByPage; // Índice final
        //     vm.peoplePaginated = vm.people.slice(start, end); // Atualiza apenas os registros da página atual
        //     vm.updateRowRange(); // Atualiza o intervalo visível
        // };
        vm.getPeoplePaginated = function () {
            var start = (vm.currentPage - 1) * vm.linesByPage; // Índice inicial
            var end = start + vm.linesByPage; // Índice final
            vm.peoplePaginated = vm.filteredPeople.slice(start, end); // Atualiza apenas os registros filtrados
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

        // Função para excluir uma pessoa
        vm.deletePerson = function (id) {
            if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
                ApiService.deletePerson(id)
                    .then(function (response) {
                        vm.addAlert('success', response.message || 'Pessoa excluída com sucesso!');

                        // Atualiza a lista local após a exclusão
                        vm.people = vm.people.filter(function (person) {
                            return person.id !== id;
                        });
                        vm.totalPeople = vm.people.length; // Atualiza o total
                        vm.loadData();
                    })
                    .catch(function (error) {
                        vm.addAlert('danger', 'Erro ao excluir a pessoa.');
                        console.error('Erro:', error);
                    });
            }
        };
    }]);
