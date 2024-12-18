angular.module('meuApp')
    .controller('EditContactModalController', ['$scope', '$rootScope', 'ApiService', function ($scope, $rootScope, ApiService) {
        var vm = this;

        // Dados do formulário e controle de abas
        vm.editPersonData = {};
        vm.activeTab = 'dados'; // Valor padrão
        vm.newContact = null; // Armazena o contato em edição
        vm.hasContacts = false;

        $rootScope.$on('setActiveTab', function (event, tab) {
            vm.activeTab = tab;
            console.log('Aba ativa definida para:', vm.activeTab);
        });
        vm.setActiveTab = function (tab) {
            vm.activeTab = tab;
            if (tab == 'contatos') {
                // console.log('troquei', vm.editPersonData , tab);
                ApiService.getPersonById(vm.editPersonData.id)
                    .then(function (response) {
                        vm.editPersonData = response.data; // Preenche os dados para edição
                        console.log('Dados carregados para edição:', vm.editPersonData);
                        vm.getContactsByPersonId(vm.editPersonData.id);
                    })
                    .catch(function (error) {
                        console.error('Erro ao carregar os dados para edição:', error);
                        alert('Erro ao carregar os dados para edição.');
                    });
            }
        }

        vm.alerts = [];
        vm.addAlert = function (type, message) {
            vm.alerts.push({ type: type, message: message });
        };
        vm.closeAlert = function (index) {
            vm.alerts.splice(index, 1);
        };

        // Escuta o evento emitido no $rootScope para carregar os dados da pessoa
        $rootScope.$on('editPersonEvent', function (event, id) {
            console.log('ID recebido no modal via evento:', id);

            // Função para buscar os dados da pessoa
            ApiService.getPersonById(id)
                .then(function (response) {
                    vm.editPersonData = response.data; // Preenche os dados para edição
                    console.log('Dados carregados para edição:', vm.editPersonData);
                    vm.getContactsByPersonId(vm.editPersonData.id);
                })
                .catch(function (error) {
                    console.error('Erro ao carregar os dados para edição:', error);
                    alert('Erro ao carregar os dados para edição.');
                });
            
        });

        vm.contactTypeMap = {
            1: 'Email',
            2: 'Telefone',
            3: 'WhatsApp'
        };

        // ng-if="(modalCtrl.newContact && modalCtrl.activeTab === 'dados') || (!modalCtrl.newContact && modalCtrl.activeTab === 'dados')
        //                 || (!modalCtrl.newContact && modalCtrl.activeTab === 'contatos')"

        vm.getContactsByPersonId = function (personId) {
            // Chama a API para buscar os contatos pelo personId
            if (personId) {
                ApiService.getContactsByPersonId(personId)
                .then(function (response) {
                    vm.editPersonData.contacts = response.data; // Preenche os contatos com os dados retornados
                    vm.hasContacts = true;
                    console.log('Contatos carregados:', vm.editPersonData.contacts);
                })
                .catch(function (error) {
                    vm.addNewContact();
                    vm.hasContacts = false;
                    console.error('Erro ao carregar contatos:', error);
                    vm.addAlert('info', 'Nenhum contato encontrado para essa pessoa');
                    // alert('Erro ao carregar os contatos. Tente novamente mais tarde. <<<');
                });
            }
            // // Verifica se não há contatos e altera para a aba "Contatos"
            // if (!vm.editPersonData.contacts || vm.editPersonData.contacts.length === 0) {
            //     vm.editPersonData.contacts = [];
            //     // console.warn(response.message || 'Nenhum contato encontrado.');
            //     vm.activeTab = 'contatos'; // Altera para a aba "Contatos"
            //     // vm.addNewContact(); // Prepara o formulário de inclusão de um novo contato
            // }
        };

        // Função para salvar as alterações
        vm.saveEdit = function () {
            console.log('Salvando:', vm.editPersonData);
            console.log('Salvando:', vm.activeTab);

            if (vm.newContact && vm.activeTab === 'contatos') {
                if (vm.validateNewContact()) {
                    console.log('Success: Contato válido:', vm.newContact);
                    vm.saveNewContact();
                    // Lógica para salvar o contato
                } else {
                    vm.addAlert('danger', 'Contato inválido!');
                    console.log('Erro: Contato inválido!');
                    vm.cancelNewContact();
                }
            }else{
                ApiService.updatePerson(vm.editPersonData.id, vm.editPersonData)
                    .then(function (response) {
                        alert('Pessoa atualizada com sucesso!');
                        console.log('Pessoa atualizada:', response);
    
                        // Fecha o modal
                        var modalElement = document.getElementById('editModal');
                        if (modalElement) {
                            var myModal = bootstrap.Modal.getInstance(modalElement);
                            if (myModal) {
                                myModal.hide();
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
            }

        };

        // Função para cancelar a edição
        vm.cancelEdit = function () {
            var modalElement = document.getElementById('editModal');
            var myModal = bootstrap.Modal.getInstance(modalElement);
            myModal.hide(); // Fecha o modal
        };

        // Funções para contatos (Aba Contatos)
        vm.addContact = function () {
            vm.editPersonData.contacts.push({
                name: '',
                type: '',
                value: ''
            });
        };

        vm.addNewContact = function () {
            vm.newContact = { name: '', type: '', value: '' }; // Inicializa o novo contato
        };

        vm.isContactValid = null; // Inicializa como nulo para evitar cor até o primeiro input
        vm.validateNewContact = function() {
            const { type, value } = vm.newContact;

            // Validação para campo obrigatório de tipo
            if (!type || type.trim() === '') {
                vm.isContactValid = false;
                return false;
            }
            // Validação para campo obrigatório de valor
            if (!value || value.trim() === '') {
                vm.isContactValid = false;
                return false;
            }
            // Validação para email
            if (type === '1') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) {
                    vm.isContactValid = false;
                    return false;
                }
            }
            // Validação para telefone no padrão brasileiro
            if (type === '2' || type === '3') {
                const brazilianPhoneRegex = /^(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})\-?\d{4}$/;

                if (!brazilianPhoneRegex.test(value.trim())) {
                    vm.isContactValid = false;
                    return false;
                }
            }
            // Caso passe todas as validações
            vm.isContactValid = true;
            return true;
        };

        vm.saveNewContact = function () {
            // Formata o contato no formato esperado pela API
            const formattedContact = {
                tipo: vm.newContact.type, // Mapeia o tipo
                descricao: vm.newContact.name || null, // Mapeia a descrição (ou null se não preenchido)
                valor: vm.newContact.value, // Mapeia o valor
                pessoa_id: vm.editPersonData.id // Mapeia o ID da pessoa
            };
    
            // Faz a chamada para a API para salvar o contato
            ApiService.createContact(formattedContact)
                .then(function (response) {
                    vm.getContactsByPersonId(vm.editPersonData.id);
                    vm.addAlert('success', 'Contato adicionado com sucesso!');
                    vm.newContact = null;
                })
                .catch(function (error) {
                    console.error('Erro ao salvar o contato na API:', error);
                    alert(error.data.error || 'Erro ao criar pessoa.');
                    vm.addAlert('danger', 'Erro ao salvar o contato. Por favor, tente novamente.'); // Mensagem genérica
                });
        };

        vm.cancelNewContact = function () {
            vm.newContact = null; // Cancela o novo contato
        };

        vm.deleteContact = function (contact) {
            if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
                ApiService.deleteContact(contact.id)
                    .then(function (response) {
                        alert(response.message || 'Pessoa excluída com sucesso!');

                        var index = vm.editPersonData.contacts.indexOf(contact);
                        if (index > -1) {
                            vm.editPersonData.contacts.splice(index, 1);
                        }
                    })
                    .catch(function (error) {
                        vm.addAlert('danger', 'Erro ao excluir a pessoa.');
                        console.error('Erro:', error);
                    });
            }
            // if (confirm('Tem certeza que deseja excluir este contato?')) {
            //     var index = vm.editPersonData.contacts.indexOf(contact);
            //     if (index > -1) {
            //         vm.editPersonData.contacts.splice(index, 1);
            //     }
            // }
        };

        vm.editContact = function (contact) {
            // Lógica para edição de um contato específico
            console.log('Editando contato:', contact);
            alert('A funcionalidade de edição de contatos está em desenvolvimento.');
        };
    }]);
