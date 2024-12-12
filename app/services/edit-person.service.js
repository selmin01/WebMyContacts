angular.module('meuApp')
    .service('EditPersonService', function () {
        var personId = null;

        return {
            setPersonId: function (id) {
                personId = id;
            },
            getPersonId: function () {
                return personId;
            }
        };
    });
