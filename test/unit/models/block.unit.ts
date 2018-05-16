import { BlockModel } from '../../../src/models/block';
import * as chai from 'chai';
import * as sinon from 'sinon';
import 'mocha';
const { should, expect } = chai;

describe('Block Model', () => {

    // TODO: addBlock
    
    describe('getPoolInfo', () => {
        it('should return miningInfo (for now)', () => {
            const result = BlockModel.getPoolInfo('');
            result.should.equal('miningPool');
        });
    });

    describe('getLocalTip', () => {
        let sandbox;
        beforeEach( () => {
            sandbox = sinon.sandbox.create();
        });
        afterEach( () => {
            sandbox.restore();
        });
        it('should return with height zero if there are no blocks', async () => {
            sandbox.stub(BlockModel, 'findOne'). returns({
                sort: sandbox.stub().returnsThis(),
                exec: sandbox.stub().returns(null, null)
            });
            const params = { chain: 'BTC', network: 'regtest' };
            const result = await BlockModel.getLocalTip(params);
            result.should.deep.equal({height: 0});
            });
        });
    });

    describe('getLocatorHashes', () => {
        let sandbox;
        beforeEach( () => {
            sandbox = sinon.sandbox.create();
        });
        afterEach( () => {
            sandbox = sandbox.restore();
        });
        it('should return 65 zeros if there are no processed blocks for the chain and network', function(done){
            sandbox.stub(BlockModel, 'find').returns({
                limit: sandbox.stub().returnsThis(),
                sort: sandbox.stub().returnsThis(),
                exec: sandbox.stub().yields(null, [])
            });
            const params = {
                chain: 'BTC',
                network: 'regtest'
            };
            BlockModel.getLocatorHashes(params,function(err, result){
                expect(err).not.exist;
                result.should.deep.equal([Array(65).join('0')]);
                done();
            });
        });
    });

    // describe('handleReorg', () => {
    //     let sandbox;
    //     beforeEach( () => {
    //         sandbox = sinon.sandbox.create(); 
    //     });
    //     afterEach( () => {
    //         sandbox = sandbox.restore();
    //     }); 
    // });

});