import assert from 'node:assert/strict';
import { buildSyntheticEvents } from './modules/simulation/simulation.service.js';

const events = buildSyntheticEvents(6);

assert.equal(events.length, 6);
assert.ok(events.every((event) => event.regionId.startsWith('sa4-')));
assert.ok(events.every((event) => event.employmentRatePercent >= 0));
assert.ok(events.some((event) => event.eventType === 'TrainingCompletionRecorded'));

console.log('simulation contract tests passed');
