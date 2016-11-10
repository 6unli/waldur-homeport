'use strict';

(function() {
    angular.module('ncsaas')
        .service('invoicesService', ['baseServiceClass', '$http', 'ENV', '$state', invoicesService]);

    function invoicesService(baseServiceClass, $http, ENV, $state) {
        /*jshint validthis: true */
        var ServiceClass = baseServiceClass.extend({
            init:function() {
                this._super();
                this.endpoint = '/invoices/';
            },
            sendNotification: function(invoice_uuid) {
                var url = ENV.apiEndpoint + 'api' + this.endpoint + invoice_uuid + '/send_notification/';
                return $http.post(url, {link_template: this.getTemplateUrl()});
            },
            getTemplateUrl: function() {
                var path = $state.href('organization.invoiceDetails', {uuid: 'TEMPLATE'});
                return location.origin + path.replace('TEMPLATE', '{uuid}');
            }
        });
        return new ServiceClass();
    }

})();
