// Use $scope para dados e métodos locais, específicos para um controlador ou diretiva.
// Use $rootScope para dados ou eventos que precisam ser compartilhados entre controladores e diretivas em diferentes partes da aplicação.
// Evite usar $rootScope em excesso, pois pode introduzir dependências globais difíceis de depurar.

angular.module('meuApp')
    .controller('EditContactModalController', ['$scope', '$rootScope', 'ApiService', function ($scope, $rootScope, ApiService) {
        var vm = this;

        // Dados do formulário
        vm.editPersonData = {};

        // Escuta o evento emitido no $rootScope
        $rootScope.$on('editPersonEvent', function (event, id) {
            console.log('ID recebido no modal via evento:', id);

            // Função para buscar os dados da pessoa
            vm.getEditPerson = function () {
                ApiService.getPersonById(id)
                    .then(function (response) {
                        vm.editPersonData = response.data; // Preenche os dados para edição
                        console.log('Dados carregados para edição:', vm.editPersonData);
                    })
                    .catch(function (error) {
                        console.error('Erro ao carregar os dados para edição:', error);
                        alert('Erro ao carregar os dados para edição.');
                    });
            };

            // Chama a função para buscar os dados
            vm.getEditPerson();
        });

        // Função para salvar as alterações
        vm.saveEdit = function () {
            console.log('passo', vm.editPersonData)
            ApiService.updatePerson(vm.editPersonData.id, vm.editPersonData)
                .then(function (response) {
                    alert('Pessoa atualizada com sucesso!');
                    // vm.addAlert('success', response.message || 'Pessoa atualizada com sucesso!');
                    console.log('Pessoa atualizada:', response);

                    var modalElement = document.getElementById('editModal');
                    if (modalElement) {
                        var myModal = bootstrap.Modal.getInstance(modalElement);
                        if (myModal) {
                            myModal.hide(); // Fecha o modal
                        } else {
                            console.warn('Nenhuma instância do modal foi encontrada.');
                        }
                    }
                    // Emite o evento para atualizar os dados no MainController
                    $rootScope.$emit('dataUpdatedEvent');
                })
                .catch(function (error) {
                    console.error('Erro ao salvar os dados editados:', error);
                    alert('Erro ao salvar os dados editados.');
                });
        };

        // Função para cancelar a edição
        vm.cancelEdit = function () {
            var modalElement = document.getElementById('editModal');
            var myModal = bootstrap.Modal.getInstance(modalElement);
            myModal.hide(); // Fecha o modal
        };
    }]);
