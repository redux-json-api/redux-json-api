import expect from 'expect';
import { getPaginationUrl } from '../src/utils';

const path = 'http://localhost';

const responseWithLinksFullUrl = {
  links: {
    prev: `${path}/transactions/1`,
    next: `${path}/transactions/3`,
  }
};

const responseWithLinks = {
  links: {
    prev: 'transactions/1',
    next: 'transactions/3',
  }
};

const responseWithNullLinks = {
  links: {
    prev: null,
    next: null,
  }
};

describe('Pagination URLs', () => {
  it('should return a truncated link for the previous page', () => {
    const r = getPaginationUrl(responseWithLinksFullUrl, 'prev', path);
    expect(r).toEqual('transactions/1');
  });

  it('should return a truncated link for the next page', () => {
    const r = getPaginationUrl(responseWithLinksFullUrl, 'next', path);
    expect(r).toEqual('transactions/3');
  });

  it('should return a link for the previous page', () => {
    const r = getPaginationUrl(responseWithLinks, 'prev', path);
    expect(r).toEqual('transactions/1');
  });

  it('should return a link for the next page', () => {
    const r = getPaginationUrl(responseWithLinks, 'next', path);
    expect(r).toEqual('transactions/3');
  });

  it('should return null for the previous page', () => {
    const r = getPaginationUrl(responseWithNullLinks, 'prev', path);
    expect(r).toEqual(null);
  });

  it('should return null for the next page', () => {
    const r = getPaginationUrl(responseWithNullLinks, 'next', path);
    expect(r).toEqual(null);
  });
});
