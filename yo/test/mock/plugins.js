'use strict';

angular.module('pluginsFeed', []).
    value('api', {
        'links':{
            'serial-ports':'/api/v1/users/local/hubs/local/serialPorts',
            'email':'/api/v1/users/local/hubs/local/configuration/email',
            'plugins':'/api/v1/users/local/hubs/local/plugins',
            'name':'/api/v1/users/local/hubs/local/configuration/name',
            'password':'/api/v1/users/local/hubs/local/configuration/password',
            'tasks':'/api/v1/users/local/hubs/local/tasks',
            'devices':'/api/v1/users/local/hubs/local/devices',
            'global-variables':'/api/v1/users/local/hubs/local/globalVariables'
        },
        'version':'0.0.4-SNAPSHOT'
    }).
    value('noUpdates', [
        {
            'status':{
                'status':'RUNNING'
            },
            'name':'Apache Felix Bundle Repository',
            'currentVersion':'1.6.6',
            'links':{
                'reload':'/api/v1/users/local/hubs/local/plugins/org.apache.felix.bundlerepository/reload'
            },
            'type':'FRAMEWORK'
        },{
            'latestVersion':'0.0.1.SNAPSHOT',
            'status':{
                'status':'NOT_INSTALLED'
            },
            'description':'Provides the ability to control DSC alarm systems.',
            'name':'DSC Alarm Plugin',
            'links':{
                'install':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-dsc/0.0.1.SNAPSHOT/install'
            },
            'type':'PLUGIN'
        },{
            'latestVersion':'0.0.1.SNAPSHOT',
            'status':{
                'status':'NOT_INSTALLED'
            },
            'description':'Provides the ability to control Foscam web cameras.',
            'name':'Foscam Camera Plugin',
            'links':{
                'install':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-foscamcamera/0.0.1.SNAPSHOT/install'
            },
            'type':'PLUGIN'
        },{
            'status':{
                'status':'RUNNING'
            },
            'name':'Web Management Plugin',
            'currentVersion':'0.0.5.SNAPSHOT',
            'links':{
                'reload':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-webconsole/reload'
            },
            'type':'CORE'
        },{
            'status':{
                'message':'Serial port is not set in driver configuration',
                'status':'FAILED'
            },
            'name':'Z-Wave Plugin',
            'currentVersion':'0.0.1.SNAPSHOT',
            'links':{
                'configuration':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/configuration',
                'reload':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/reload'
            },
            'type':'PLUGIN'
        }
    ]).value('oneUpdate', [
        {
            'status':{
                'message':'Serial port is not set in driver configuration',
                'status':'RUNNING'
            },
            'name':'Z-Wave Plugin',
            'currentVersion':'0.0.1.SNAPSHOT',
            'latestVersion':'0.0.2.SNAPSHOT',
            'links':{
                'reload':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/reload',
                'update':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/update'
            },
            'type':'PLUGIN'
        }
    ]).value('oneUpdateNotUpdated', [
        {
            'currentVersion':'0.0.1.SNAPSHOT'
        }
    ]).value('oneUpdateUpdated', [
        {
            'currentVersion':'0.0.2.SNAPSHOT'
        }
    ]).value('twoUpdates', [
        {
            'status': {
                'message': 'Serial port is not set in driver configuration',
                'status': 'RUNNING'
            },
            'name': 'Z-Wave Plugin',
            'currentVersion': '0.0.1.SNAPSHOT',
            'links': {
                'reload': '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/reload',
                'update': '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-zwave/update'
            },
            'type': 'PLUGIN'
        },{
            'status':{
                'status':'RUNNING'
            },
            'name':'Web Management Plugin',
            'currentVersion':'0.0.5.SNAPSHOT',
            'links':{
                'reload':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-webconsole/reload',
                'update':'/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-webconsole/update'
            },
            'type':'CORE'
        }
    ]).value('empty', [
    ]);
