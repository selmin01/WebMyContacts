angular.module('meuApp')
    .controller('NewContactModalController', ['$scope', '$rootScope', 'ApiService', function ($scope, $rootScope, ApiService) {
        var vm = this;

        // // Dados do formulário
        // vm.formData = {
        //     name: '',
        //     tipo: 'Física' // Valor padrão
        // };

        // Função para salvar os dados
        vm.saveData = function () {
            if (vm.formData.name.trim() === '') {
                alert('O campo Nome é obrigatório! <<< AQUI');
                return;
            }
            console.log(vm.formData);
            // Simulando envio ao backend (exemplo com $http)
            ApiService.createPerson(vm.formData)
                .then(function (response) {
                    alert('Pessoa criada com sucesso!');
                    // vm.addAlert('success', response.message || 'Pessoa incluída com sucesso!');
                    console.log('Pessoa criada:', response);

                    var modalElement = document.getElementById('NewContactModal');
                    if (modalElement) {
                        var myModal = bootstrap.Modal.getInstance(modalElement);
                        if (myModal) {
                            myModal.hide(); // Fecha o modal
                        } else {
                            console.warn('Nenhuma instância do modal foi encontrada.');
                        }
                    }
                    // Emite o evento para atualizar os dados no MainController
                    $rootScope.$emit('dataCreateEvent');
                })
                .catch(function (error) {
                    alert(error.data.error || 'Erro ao criar pessoa.');
                    console.error('Erro ao criar pessoa:', error);
                });
        };

        // Função para cancelar e limpar o formulário
        vm.cancel = function () {
            vm.formData = { name: '', tipo: 'Física' }; // Reseta os dados
            var modalElement = document.getElementById('exampleModal');
            var myModal = bootstrap.Modal.getInstance(modalElement);
            myModal.hide(); // Fecha o modal
        };
    }]);
