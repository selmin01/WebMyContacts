angular.module('meuApp')
    .controller('NewContactModalController', ['$http', '$rootScope', function ($http, $rootScope) {
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
            $http.post('http://localhost:8000/api/person', vm.formData, {headers: {
                'Content-Type': 'application/json'
            }})
                .then(function (response) {
                    alert('Dados salvos com sucesso!');
                    console.log('Resposta do servidor:', response.data);
                    
                    // Fechar o modal após o sucesso
                    var modalElement = document.getElementById('exampleModal');
                    var myModal = bootstrap.Modal.getInstance(modalElement);
                    
                    myModal.hide();

                    // Chama a função `loadData` do MainController
                    $rootScope.$broadcast('dataUpdated'); 
                })
                .catch(function (error) {
                    alert('Erro ao salvar os dados!');
                    console.error('Erro:', error);
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
