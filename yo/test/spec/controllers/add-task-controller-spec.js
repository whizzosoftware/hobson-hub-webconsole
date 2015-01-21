'use strict';

describe('Controller: AddTasksController', function () {

  // load the controller's module
  beforeEach(module('hobsonApp'));

  var scope, createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    createController = function() {
      return $controller('AddTasksController', {
        '$scope': scope,
        'daysOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        'monthsOfYear': [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]
      });
    };
  }));

  it('test scheduled state to task 1', function() {
    createController();
    var task = scope.createTaskFromState({
      name: 'Foo',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      startType: 'time',
      startDate: new Date(86400000),
      startTime: new Date(86400000)
    });
    expect(task.name).toBe('Foo');
    expect(task.provider).toBe('com.whizzosoftware.hobson.hub.hobson-hub-scheduler');
    expect(task.conditions.length).toBe(1);
    expect(task.conditions[0].start).toBe('19700101T170000');
  });

  it('test scheduled state with positive sunrise offset to task', function() {
    createController();
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      startType: 'sunOffset',
      startDate: new Date(86400000),
      startTime: new Date(86400000),
      sunOffsetValue: 30,
      sunOffsetMod: 1,
      sunOffsetType: 'SR'
    });
    expect(task.name).toBe('Foo2');
    expect(task.provider).toBe('com.whizzosoftware.hobson.hub.hobson-hub-scheduler');
    expect(task.conditions.length).toBe(1);
    expect(task.conditions[0].start).toBe('19700101T000000');
    expect(task.conditions[0].sunOffset).toBe('SR30');
  });

  it('test scheduled state with negative sunrise offset to task', function() {
    createController();
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      startType: 'sunOffset',
      startDate: new Date(86400000),
      startTime: new Date(86400000),
      sunOffsetValue: 20,
      sunOffsetMod: -1,
      sunOffsetType: 'SR'
    });
    expect(task.name).toBe('Foo2');
    expect(task.provider).toBe('com.whizzosoftware.hobson.hub.hobson-hub-scheduler');
    expect(task.conditions.length).toBe(1);
    expect(task.conditions[0].start).toBe('19700101T000000');
    expect(task.conditions[0].sunOffset).toBe('SR-20');
  });

  it('test scheduled state with positive sunset offset to task', function() {
    createController();
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      startType: 'sunOffset',
      startDate: new Date(86400000),
      startTime: new Date(86400000),
      sunOffsetValue: 120,
      sunOffsetMod: 1,
      sunOffsetType: 'SS'
    });
    expect(task.name).toBe('Foo2');
    expect(task.provider).toBe('com.whizzosoftware.hobson.hub.hobson-hub-scheduler');
    expect(task.conditions.length).toBe(1);
    expect(task.conditions[0].start).toBe('19700101T000000');
    expect(task.conditions[0].sunOffset).toBe('SS120');
  });

  it('test scheduled state with negative sunset offset to task', function() {
    createController();
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      startType: 'sunOffset',
      startDate: new Date(86400000),
      startTime: new Date(86400000),
      sunOffsetValue: 10,
      sunOffsetMod: -1,
      sunOffsetType: 'SS'
    });
    expect(task.name).toBe('Foo2');
    expect(task.provider).toBe('com.whizzosoftware.hobson.hub.hobson-hub-scheduler');
    expect(task.conditions.length).toBe(1);
    expect(task.conditions[0].start).toBe('19700101T000000');
    expect(task.conditions[0].sunOffset).toBe('SS-10');
  });

  it('test scheduled state with daily recurrence no end date', function() {
    createController();
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 3,
        interval: 1,
        endType: 'never'
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=DAILY;INTERVAL=1');
  });

  it('test scheduled state with weekly recurrence no end date', function() {
    createController();

    // test every 3 weeks with no end date
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 2,
        interval: 3,
        endType: 'never'
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=WEEKLY;INTERVAL=3');

    // test every 2 weeks on Mondays, Wednesdays and Fridays with no end date
    task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 2,
        interval: 2,
        endType: 'never',
        weekDays: {
          'Mon': true,
          'Tue': false,
          'Wed': true,
          'Thu': false,
          'Fri': true,
          'Sat': false,
          'Sun': false
        }
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE,FR');
  });

  it('test scheduled state with monthly recurrence', function() {
    createController();

    // test every six months with no end date
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 1,
        interval: 6,
        endType: 'never'
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=MONTHLY;INTERVAL=6');

    // test every four months for 3 times
    task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 1,
        interval: 4,
        endType: 'after',
        count: 3
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=MONTHLY;INTERVAL=4;COUNT=3');

    // test every 1 month on the 15th day of the month with no end date
    task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 1,
        interval: 1,
        endType: 'never',
        monthRepeatType: 'bymonthday',
        dayOfMonth: 15
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15');

    // test every 3 months on the second thursday of the month with no end date
    task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 1,
        interval: 3,
        endType: 'never',
        monthRepeatType: 'byweekday',
        weekdayOfMonthIndex: 2,
        weekdayOfMonth: {
          name: 'Thursday'
        }
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=MONTHLY;INTERVAL=3;BYSETPOS=2;BYDAY=TH');
  });

  it('test scheduled state with yearly recurrence', function() {
    createController();

    // test every four years with no end date
    var task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 0,
        interval: 4,
        endType: 'never'
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=YEARLY;INTERVAL=4');

    // test every year on july 4th with no end date
    task = scope.createTaskFromState({
      name: 'Foo2',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      recurrence: {
        type: 0,
        interval: 1,
        endType: 'never',
        yearRepeatType: 'monthDay',
        monthOfYear: {
          name: 'July'
        },
        dayOfMonth: {
          name: '4'
        }
      }
    });
    expect(task.conditions[0].recurrence).toBe('FREQ=YEARLY;INTERVAL=1;BYMONTH=7;BYMONTHDAY=4');
  });

  it('test every day from task', function() {
    createController();

    // test every day 30 minutes after sunset
    var state = scope.createStateFromTask({
      name: 'Foo',
      provider: 'com.whizzosoftware.hobson.hub.hobson-hub-scheduler',
      conditions: [{
        start: '20150102T000000',
        recurrence: 'FREQ=DAILY;INTERVAL=1',
        sunOffset: 'SS30'
      }]
    });
    expect(state.name).toBe('Foo');
    expect(state.provider).toBe('com.whizzosoftware.hobson.hub.hobson-hub-scheduler');
    expect(state.startType).toBe('sunOffset');
    expect(state.startDate.getFullYear()).toBe(2015);
    expect(state.startDate.getMonth()).toBe(0);
    expect(state.startDate.getDate()).toBe(2);
    expect(state.startDate.getHours()).toBe(0);
    expect(state.startDate.getMinutes()).toBe(0);
    expect(state.startType).toBe('sunOffset');
    expect(state.sunOffsetType).toBe('SS');
    expect(state.sunOffsetMod).toBe(1);
    expect(state.sunOffsetValue).toBe(30);
    expect(state.recurrence.type).toBe(3);
    expect(state.recurrence.interval).toBe(1);
    expect(state.recurrence.endType).toBe('never');
  });

  it('test every week from string', function() {
    createController();

    // test every week
    var state = scope.createStateFromTask({
      conditions: [{
        recurrence: 'FREQ=WEEKLY;INTERVAL=1'
      }]
    });
    expect(state.recurrence.type).toBe(2);
    expect(state.recurrence.interval).toBe(1);
    expect(state.recurrence.endType).toBe('never');

    // test every 3 weeks on Monday, Wednesday and Friday
    state = scope.createStateFromTask({
      conditions: [{
        recurrence: 'FREQ=WEEKLY;INTERVAL=3;BYDAY=MO,WE,FR',
        sunOffset: 'SR-10'
      }]
    });
    expect(state.recurrence.type).toBe(2);
    expect(state.recurrence.interval).toBe(3);
    expect(state.recurrence.endType).toBe('never');
    expect(state.recurrence.weekDays.Mon).toBe(true);
    expect(state.recurrence.weekDays.Tue).toBe(false);
    expect(state.recurrence.weekDays.Wed).toBe(true);
    expect(state.recurrence.weekDays.Thu).toBe(false);
    expect(state.recurrence.weekDays.Fri).toBe(true);
    expect(state.recurrence.weekDays.Sat).toBe(false);
    expect(state.recurrence.weekDays.Sun).toBe(false);
    expect(state.startType).toBe('sunOffset');
    expect(state.sunOffsetType).toBe('SR');
    expect(state.sunOffsetMod).toBe(-1);
    expect(state.sunOffsetValue).toBe(10);
  });

  it('test every month from string', function() {
    createController();

    // test every 6 months
    var state = scope.createStateFromTask({
      conditions: [{
        recurrence: 'FREQ=MONTHLY;INTERVAL=6'
      }]
    });
    expect(state.recurrence.type).toBe(1);
    expect(state.recurrence.interval).toBe(6);
    expect(state.recurrence.endType).toBe('never');

    // test every 3 months on the 15th day
    state = scope.createStateFromTask({
      conditions: [{
        start: '20141210T063000',
        recurrence: 'FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=15'
      }]
    });
    expect(state.recurrence.type).toBe(1);
    expect(state.recurrence.interval).toBe(3);
    expect(state.recurrence.endType).toBe('never');
    expect(state.recurrence.monthRepeatType).toBe('bymonthday');
    expect(state.recurrence.dayOfMonth).toBe(15);
    expect(state.startDate.getFullYear()).toBe(2014);
    expect(state.startDate.getMonth()).toBe(11);
    expect(state.startDate.getDate()).toBe(10);
    expect(state.startDate.getHours()).toBe(6);
    expect(state.startDate.getMinutes()).toBe(30);
    expect(state.startTime.getHours()).toBe(6);
    expect(state.startTime.getMinutes()).toBe(30);

    // test every 9 months on the second thursday of the month with no end date
    state = scope.createStateFromTask({
      conditions: [{
        recurrence: 'FREQ=MONTHLY;INTERVAL=9;BYSETPOS=2;BYDAY=TH'
      }]
    });
    expect(state.recurrence.type).toBe(1);
    expect(state.recurrence.interval).toBe(9);
    expect(state.recurrence.endType).toBe('never');
    expect(state.recurrence.monthRepeatType).toBe('byweekday');
    expect(state.recurrence.weekdayOfMonthIndex).toBe(2);
    expect(state.recurrence.weekdayOfMonth.name).toBe('Thursday');
  });

  it('test every year from string', function() {
    createController();

    // test every 4 years
    var state = scope.createStateFromTask({
      conditions: [{
        recurrence: 'FREQ=YEARLY;INTERVAL=4'
      }]
    });
    expect(state.recurrence.type).toBe(0);
    expect(state.recurrence.interval).toBe(4);

    // test every year on july 4th with no end date
    state = scope.createStateFromTask({
      conditions: [{
        recurrence: 'FREQ=YEARLY;INTERVAL=1;BYMONTH=7;BYMONTHDAY=4'
      }]
    });
    expect(state.recurrence.type).toBe(0);
    expect(state.recurrence.interval).toBe(1);
    expect(state.recurrence.endType).toBe('never');
    expect(state.recurrence.yearRepeatType).toBe('monthDay');
    expect(state.recurrence.monthOfYear.name).toBe('July');
    expect(state.recurrence.dayOfMonth.name).toBe('4');
  });
});
