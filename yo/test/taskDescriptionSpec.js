define(['jquery', 'underscore', 'moment', 'rrule', 'nlp', 'taskDescription'], function ($, _, moment, RRule, nlp, taskDescription) {
	
	describe('test create recurrence description', function () {
		it('should work correctly', function () {
			expect(taskDescription.createDescription({})).toBe('');

			var ct = {
				descriptionTemplate: '{recurrence}',
				properties: {
					recurrence: ''
				}
			};

			ct.properties.recurrence = 'FREQ=DAILY;INTERVAL=1';
			expect(taskDescription.createDescription(ct)).toBe('every day');
			ct.properties.recurrence = 'FREQ=DAILY;INTERVAL=2';
			expect(taskDescription.createDescription(ct)).toBe('every 2 days');
			ct.properties.recurrence = 'FREQ=DAILY;INTERVAL=3';
			expect(taskDescription.createDescription(ct)).toBe('every 3 days');
			ct.properties.recurrence = 'FREQ=DAILY;INTERVAL=4';
			expect(taskDescription.createDescription(ct)).toBe('every 4 days');
			ct.properties.recurrence = 'FREQ=DAILY;INTERVAL=5';
			expect(taskDescription.createDescription(ct)).toBe('every 5 days');
			ct.properties.recurrence = 'FREQ=DAILY;INTERVAL=6';
			expect(taskDescription.createDescription(ct)).toBe('every 6 days');
			ct.properties.recurrence = 'FREQ=WEEKLY;INTERVAL=1';
			expect(taskDescription.createDescription(ct)).toBe('every week');
			ct.properties.recurrence = 'FREQ=WEEKLY;INTERVAL=2';
			expect(taskDescription.createDescription(ct)).toBe('every 2 weeks');
			ct.properties.recurrence = 'FREQ=WEEKLY;INTERVAL=3';
			expect(taskDescription.createDescription(ct)).toBe('every 3 weeks');
			ct.properties.recurrence = 'FREQ=WEEKLY;INTERVAL=4';
			expect(taskDescription.createDescription(ct)).toBe('every 4 weeks');
			ct.properties.recurrence = 'FREQ=WEEKLY;INTERVAL=5';
			expect(taskDescription.createDescription(ct)).toBe('every 5 weeks');
			ct.properties.recurrence = 'FREQ=WEEKLY;INTERVAL=6';
			expect(taskDescription.createDescription(ct)).toBe('every 6 weeks');
			ct.properties.recurrence = 'FREQ=MONTHLY;INTERVAL=1';
			expect(taskDescription.createDescription(ct)).toBe('every month');
			ct.properties.recurrence = 'FREQ=MONTHLY;INTERVAL=2';
			expect(taskDescription.createDescription(ct)).toBe('every 2 months');
			ct.properties.recurrence = 'FREQ=MONTHLY;INTERVAL=3';
			expect(taskDescription.createDescription(ct)).toBe('every 3 months');
			ct.properties.recurrence = 'FREQ=MONTHLY;INTERVAL=4';
			expect(taskDescription.createDescription(ct)).toBe('every 4 months');
			ct.properties.recurrence = 'FREQ=MONTHLY;INTERVAL=5';
			expect(taskDescription.createDescription(ct)).toBe('every 5 months');
			ct.properties.recurrence = 'FREQ=MONTHLY;INTERVAL=6';
			expect(taskDescription.createDescription(ct)).toBe('every 6 months');
			ct.properties.recurrence = 'FREQ=YEARLY;INTERVAL=1';
			expect(taskDescription.createDescription(ct)).toBe('every year');
		});
    });

	describe('test create time description', function () {
		it('should work correctly', function () {
			var ct = {
				descriptionTemplate: '{time}',
				properties: {
					time: ''
				}
			};

			ct.properties.time = '01:00';
			expect(taskDescription.createDescription(ct)).toBe('1:00 AM');
			ct.properties.time = '13:00';
			expect(taskDescription.createDescription(ct)).toBe('1:00 PM');
			ct.properties.time = 'SR';
			expect(taskDescription.createDescription(ct)).toBe('sunrise');
			ct.properties.time = 'SS';
			expect(taskDescription.createDescription(ct)).toBe('sunset');
			ct.properties.time = 'SR+0';
			expect(taskDescription.createDescription(ct)).toBe('0 minutes after sunrise');
			ct.properties.time = 'SR-0';
			expect(taskDescription.createDescription(ct)).toBe('0 minutes before sunrise');
			ct.properties.time = 'SR+9';
			expect(taskDescription.createDescription(ct)).toBe('9 minutes after sunrise');
			ct.properties.time = 'SR-9';
			expect(taskDescription.createDescription(ct)).toBe('9 minutes before sunrise');
			ct.properties.time = 'SS+9';
			expect(taskDescription.createDescription(ct)).toBe('9 minutes after sunset');
			ct.properties.time = 'SS-9';
			expect(taskDescription.createDescription(ct)).toBe('9 minutes before sunset');
			ct.properties.time = 'SR+30';
			expect(taskDescription.createDescription(ct)).toBe('30 minutes after sunrise');
			ct.properties.time = 'SR-30';
			expect(taskDescription.createDescription(ct)).toBe('30 minutes before sunrise');
			ct.properties.time = 'SS+30';
			expect(taskDescription.createDescription(ct)).toBe('30 minutes after sunset');
			ct.properties.time = 'SS-30';
			expect(taskDescription.createDescription(ct)).toBe('30 minutes before sunset');
		});
	});
});



