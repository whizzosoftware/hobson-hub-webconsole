define(['jquery', 'underscore', 'moment', 'rrule', 'nlp', 'taskDescription'], function ($, _, moment, RRule, nlp, taskDescription) {
	
	describe('test create recurrence description', function () {
		it('should work correctly', function () {

			expect(taskDescription.createDescription(null, {})).toBe('');

			var pc = {
				cclass: {
					'@id': 'schedule'
				},
				values: {}
			};

			var pcc = {
				'@id': 'schedule',
				descriptionTemplate: '{recurrence}',
			};

			pc.values.recurrence = 'FREQ=DAILY;INTERVAL=1';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every day');
			pc.values.recurrence = 'FREQ=DAILY;INTERVAL=2';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 2 days');
			pc.values.recurrence = 'FREQ=DAILY;INTERVAL=3';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 3 days');
			pc.values.recurrence = 'FREQ=DAILY;INTERVAL=4';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 4 days');
			pc.values.recurrence = 'FREQ=DAILY;INTERVAL=5';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 5 days');
			pc.values.recurrence = 'FREQ=DAILY;INTERVAL=6';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 6 days');
			pc.values.recurrence = 'FREQ=WEEKLY;INTERVAL=1';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every week');
			pc.values.recurrence = 'FREQ=WEEKLY;INTERVAL=2';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 2 weeks');
			pc.values.recurrence = 'FREQ=WEEKLY;INTERVAL=3';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 3 weeks');
			pc.values.recurrence = 'FREQ=WEEKLY;INTERVAL=4';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 4 weeks');
			pc.values.recurrence = 'FREQ=WEEKLY;INTERVAL=5';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 5 weeks');
			pc.values.recurrence = 'FREQ=WEEKLY;INTERVAL=6';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 6 weeks');
			pc.values.recurrence = 'FREQ=MONTHLY;INTERVAL=1';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every month');
			pc.values.recurrence = 'FREQ=MONTHLY;INTERVAL=2';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 2 months');
			pc.values.recurrence = 'FREQ=MONTHLY;INTERVAL=3';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 3 months');
			pc.values.recurrence = 'FREQ=MONTHLY;INTERVAL=4';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 4 months');
			pc.values.recurrence = 'FREQ=MONTHLY;INTERVAL=5';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 5 months');
			pc.values.recurrence = 'FREQ=MONTHLY;INTERVAL=6';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every 6 months');
			pc.values.recurrence = 'FREQ=YEARLY;INTERVAL=1';
			expect(taskDescription.createDescription(pcc, pc)).toBe('every year');
		});
    });

	describe('test create time description', function () {
		it('should work correctly', function () {
			var pcc = {
				'@id': 'schedule',
				descriptionTemplate: '{time}'
			};

			var pc = {
				cclass: {
					'@id': 'schedule'
				},
				values: {}
			};

			pc.values.time = '01:00';
			expect(taskDescription.createDescription(pcc, pc)).toBe('1:00 AM');
			pc.values.time = '13:00';
			expect(taskDescription.createDescription(pcc, pc)).toBe('1:00 PM');
			pc.values.time = 'SR';
			expect(taskDescription.createDescription(pcc, pc)).toBe('sunrise');
			pc.values.time = 'SS';
			expect(taskDescription.createDescription(pcc, pc)).toBe('sunset');
			pc.values.time = 'SR+0';
			expect(taskDescription.createDescription(pcc, pc)).toBe('0 minutes after sunrise');
			pc.values.time = 'SR-0';
			expect(taskDescription.createDescription(pcc, pc)).toBe('0 minutes before sunrise');
			pc.values.time = 'SR+9';
			expect(taskDescription.createDescription(pcc, pc)).toBe('9 minutes after sunrise');
			pc.values.time = 'SR-9';
			expect(taskDescription.createDescription(pcc, pc)).toBe('9 minutes before sunrise');
			pc.values.time = 'SS+9';
			expect(taskDescription.createDescription(pcc, pc)).toBe('9 minutes after sunset');
			pc.values.time = 'SS-9';
			expect(taskDescription.createDescription(pcc, pc)).toBe('9 minutes before sunset');
			pc.values.time = 'SR+30';
			expect(taskDescription.createDescription(pcc, pc)).toBe('30 minutes after sunrise');
			pc.values.time = 'SR-30';
			expect(taskDescription.createDescription(pcc, pc)).toBe('30 minutes before sunrise');
			pc.values.time = 'SS+30';
			expect(taskDescription.createDescription(pcc, pc)).toBe('30 minutes after sunset');
			pc.values.time = 'SS-30';
			expect(taskDescription.createDescription(pcc, pc)).toBe('30 minutes before sunset');
		});
	});

	describe('test device list description', function() {
		it('should work correctly', function() {
			var pcc = {
				'@id': 'stuff',
				descriptionTemplate: '{devices}'
			};

			var pc = {
				cclass: {
					'@id': 'stuff'
				},
				values: {
					devices: [
						{ "@id": "device1" },
						{ "@id": "device2" }
					]
				}
			};

			var devices = [
				{'@id': 'device1', name: 'Device 1'},
				{'@id': 'device2', name: 'Device 2'},
				{'@id': 'device3', name: 'Device 3'},
			];

			pc.values.devices = [{"@id": "device1"}];
			expect(taskDescription.createDescription(pcc, pc, devices)).toBe('Device 1');
			pc.values.devices = [{"@id": "device1"},{"@id": "device2"}];
			expect(taskDescription.createDescription(pcc, pc, devices)).toBe('Device 1 or Device 2');
			pc.values.devices = [{"@id": "device1"},{"@id": "device2"},{"@id": "device3"}];
			expect(taskDescription.createDescription(pcc, pc, devices)).toBe('Device 1 or 2 other devices');
		});
	});

	describe('test person and location description', function() {
		it('should work correctly', function() {
			var pcc = {
				'@id': 'stuff',
				descriptionTemplate: '{person} does something at {location}'
			};

			var pc = {
				cclass: {
					'@id': 'stuff'
				},
				values: {
					person: {
						name: 'John'
					},
					location: {
						name: 'Home'
					}
				}
			};

			expect(taskDescription.createDescription(pcc, pc, [])).toBe('John does something at Home');
		});
	});
});



