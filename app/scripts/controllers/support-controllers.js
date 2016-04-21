'use strict';

(function() {
  angular.module('ncsaas')
    .controller('IssueListController',
      ['baseControllerListClass',
       'issuesService',
       'issueCommentsService',
       '$rootScope',
       'ENTITYLISTFIELDTYPES',
       'ncUtils',
        IssueListController]);

  function IssueListController(
    baseControllerListClass,
    issuesService,
    issueCommentsService,
    $rootScope,
    ENTITYLISTFIELDTYPES,
    ncUtils) {
    var controllerScope = this;
    var controllerClass = baseControllerListClass.extend({
      issueComments: {},
      expandableCommentsKey: 'comments',

      init:function() {
        this.service = issuesService;
        this.controllerScope = controllerScope;
        this.blockUIElement = 'issue-list';
        this._super();
        this.searchFieldName = 'search';
        this.entityOptions = {
          entityData: {
            title: 'Support',
            createLink: 'support.create',
            createLinkText: 'Create ticket',
            noDataText: 'No tickets yet.',
            noMatchesText: 'No tickets found matching filter.',
            hideActionButtons: false,
            hideTableHead: true,
            actionButtonsType: 'refresh',
            expandable: true
          },
          list: [
            {
              type: ENTITYLISTFIELDTYPES.statusCircle,
              className: 'statusCircle support',
              propertyName: 'resolution',
              showForMobile: true
            },
            {
              className: 'avatar',
              avatarArraySrc: [
                'assignee',
                'emailAddress'
              ],
              showForMobile: false,
              type: ENTITYLISTFIELDTYPES.avatarPictureField
            },
            {
              propertyName: 'summary',
              className: 'name support',
              subtitle: ENTITYLISTFIELDTYPES.subtitle,
              showForMobile: ENTITYLISTFIELDTYPES.showForMobile,
              type: ENTITYLISTFIELDTYPES.name
            }
          ]
        };
        this.expandableOptions = [
          {
            isList: false,
            addItemBlock: false,
            headBlock: 'description',
            hasAnswerForm: true,
            answersBlock: true,
            listKey: 'issueComments',
            modelId: 'key',
            viewType: 'support',
            minipaginationData:
            {
              pageChange: this.getCommentsForIssue.bind(this),
              pageEntityName: this.expandableCommentsKey
            }
          }
        ];
      },
      showMore: function(issue) {
        if (!this.issueComments[issue.key]) {
          this.getCommentsForIssue(issue.key);
        }
      },
      getCommentsForIssue: function(key, page) {
        ncUtils.blockElement('comments_' + key, this._getCommentsForIssue(key, page));
      },
      _getCommentsForIssue: function(key, page) {
        var vm = this;
        var filter = {
          issue_key: key
        };
        vm.issueComments[key] = {data:null};
        page = page || 1;
        issueCommentsService.page = page;
        issueCommentsService.pageSize = 5;
        vm.issueComments[key].page = page;
        issueCommentsService.filterByCustomer = false;
        return issueCommentsService.getList(filter).then(function(response) {
          vm.issueComments[key].data = response;
          vm.issueComments[key].pages = issueCommentsService.pages;
          $rootScope.$broadcast('mini-pagination:getNumberList', vm.issueComments[key].pages,
            page, vm.getCommentsForIssue.bind(vm), vm.expandableCommentsKey, key);
        });
      },
      addComment: function(issue) {
        var vm = this;
        issue.newCommentSaving = true;
        var instance = issueCommentsService.$create();
        instance.message = issue.newCommentBody;
        instance.issue = issue.url;
        instance.$save(
          function() {
            vm.getCommentsForIssue(issue.key);
            issue.newCommentSaving = false;
            issue.newCommentBody = "";
          },
          function(response) {
            issue.newCommentSaving = false;
            alert(response.data.non_field_errors);
          }
        );
      },
    });

    controllerScope.__proto__ = new controllerClass();
  }


  angular.module('ncsaas')
    .controller('IssueAddController', ['issuesService', 'baseControllerAddClass', IssueAddController]);

  function IssueAddController(issuesService, baseControllerAddClass) {
    var controllerScope = this;
    var controllerClass = baseControllerAddClass.extend({
      init: function() {
        this.service = issuesService;
        this.controllerScope = controllerScope;
        this._super();
        this.listState = 'support.list';
        this.issue = this.instance;
        this.issue.summary = "";
        this.issue.description = "";
      },
      getSuccessMessage: function() {
        return this.successMessage.replace('{vm_name}', this.instance.summary);
      }
    });

    controllerScope.__proto__ = new controllerClass();
  }

})();
