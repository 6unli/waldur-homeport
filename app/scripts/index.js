import sparkline from './components/sparkline/sparkline';
import visibleIf from './components/visibleIf/visibleIf';
import teamModule from './components/team/module';
import issuesModule from './components/issues/module';
import userModule from './components/user/module';
import providersModule from './components/providers/module';
import projectModule from './components/project/module';
import actionsModule from './components/actions/module';
import navigationModule from './components/navigation/module';
import resourceModule from './components/resource/module';
import invoicesModule from './components/invoices/module';
import authModule from './components/auth/module';
import appstoreModule from './components/appstore/module';
import formModule from './components/form/module';
import openstackModule from './components/openstack/module';
import digitaloceanModule from './components/digitalocean/module';
import customerModule from './components/customer/module';

const module = angular.module('ncsaas');

module.directive('sparkline', sparkline);
module.directive('visibleIf', visibleIf);
teamModule(module);
issuesModule(module);
userModule(module);
providersModule(module);
projectModule(module);
actionsModule(module);
navigationModule(module);
resourceModule(module);
invoicesModule(module);
authModule(module);
appstoreModule(module);
formModule(module);
openstackModule(module);
digitaloceanModule(module);
customerModule(module);
