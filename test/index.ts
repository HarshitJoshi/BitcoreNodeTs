import { ChainStateProvider } from '../src/providers/chain-state';
import * as chai from 'chai';
import 'mocha';
import { InternalStateProvider } from '../src/providers/chain-state/internal/internal';

const { should, expect } = chai;

describe('Chain State Provider', () => {
  it('Should have a chain state provider for BTC', () => {
    expect(() => {
      ChainStateProvider.get({ chain: 'BTC' });
    }).to.not.throw();
  });
  it('Should have a chain state provider for BCH', () => {
    expect(() => {
      ChainStateProvider.get({ chain: 'BCH' });
    }).to.not.throw();
  });
  it('Should not have a chain state provider for NOTAREALCOIN', () => {
    expect(() => {
      ChainStateProvider.get({ chain: 'NOTAREALCOIN' });
    }).to.throw();
  });

  it('Should be able to register a new provider', () => {
    expect(() => {
      let newInternalProvider = new InternalStateProvider('NEWCOIN');
      ChainStateProvider.registerService('NEWCOIN', newInternalProvider);
    }).to.not.throw();
  });
});
