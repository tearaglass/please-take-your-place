import test from 'node:test';
import assert from 'node:assert/strict';
import {stateAt,activeComments,advance} from '../src/timeline.js';
import {COMMENTS} from '../src/config.js';
test('seeking reconstructs roles without playback history',()=>{const expected=stateAt(70,COMMENTS);stateAt(110,COMMENTS);stateAt(0,COMMENTS);assert.deepEqual(stateAt(70,COMMENTS),expected);assert.equal(expected.seats[4].role,'you');assert.equal(expected.seats[0].role,'mother');assert.equal(expected.seats[2].role,'guest');});
test('contradictions coexist then settle',()=>{assert.equal(stateAt(62,COMMENTS).seats[1].alternate,'sister');assert.equal(stateAt(67,COMMENTS).seats[1].role,'sister');});
test('hold overrides competing roles for five playback seconds',()=>{const h=[{at:62,seat:1,role:'sister'}];assert.equal(stateAt(63,COMMENTS,h).seats[1].held,true);assert.equal(stateAt(63,COMMENTS,h).seats[1].alternate,'');assert.equal(stateAt(67,COMMENTS,h).seats[1].held,false);assert.equal(stateAt(61,COMMENTS,h).seats[1].held,false);});
test('local comments replay only during their recorded window',()=>{const comments=[...COMMENTS,{id:'local',at:23,text:'<img src=x onerror=alert(1)>',local:true}];assert.ok(activeComments(24,comments).some(c=>c.id==='local'));assert.ok(!activeComments(22,comments).some(c=>c.id==='local'));assert.ok(!activeComments(35,comments).some(c=>c.id==='local'));assert.ok(stateAt(24,comments).acknowledgment>0);});
test('loop returns to arrival and presence fades before reset',()=>{assert.equal(advance(119.5,.75),.25);assert.ok(stateAt(119.99,COMMENTS).seats.every(s=>s.strength===0));assert.ok(stateAt(0,COMMENTS).seats.every(s=>s.role===''));});
