const chai = require('chai');
const UtilService = require('../../src/components/User/service');

const { expect } = chai;

let userId = {};

describe('UserComponent -> service', () => {
    it('findAll', (done) => {
    	UtilService.findAll().then((result) => {
    		expect(result).to.be.a('array');

    		done();
    	});
    });

    it('create -> wrong data', (done) => {
    	UtilService.create({
			bla: 'Nikola Tesla',
    		blu: 'EdisonMudila@izvilin.net',
		}).catch((error) => {
			expect(error).to.have.property('name').to.be.equal('ValidationError');

			done();
		});
    });

    it('create', (done) => {
    	UtilService.create({
			fullName: 'Nikola Tesla',
    		email: 'EdisonMudila@izvilin.net',
		}).then((result) => {
			expect(result).to.have.property('_id').and.to.be.a('object');

			userId = result._id;

			done();
		});
    });

    it('findById -> wrong data', (done) => {
    	UtilService.findById('bla').catch((error) => {
			expect(error).to.have.property('name').to.be.equal('CastError');

			done();
		});
    });

    it('findById', (done) => {
    	UtilService.findById(userId).then((result) => {
    		expect(result).to.have.property('_id').and.to.be.a('object');
    		expect(result).to.have.property('fullName').and.to.be.a('string');
    		expect(result).to.have.property('email').and.to.be.a('string');

    		done();
    	});
    });

    it('updateById -> wrong id', (done) => {
    	UtilService.updateById('bla', { }).catch((error) => {
			expect(error).to.have.property('name').to.be.equal('CastError');

			done();
		});
    });

    
    it('updateById -> wrong data', (done) => {
    	UtilService.updateById(userId, { bla: 'blu' })
    	.then((result) => {
    		expect(result).to.have.property('nModified').and.to.be.equal(0);

    		done();
    	});
    });

    it('updateById', (done) => {
    	UtilService.updateById(userId, {
    		email: 'EdisonMudilO@izvilin.net',
    	}).then((result) => {
    		expect(result).to.have.property('nModified').and.to.be.equal(1);
    		expect(result).to.have.property('ok').and.to.be.equal(1);


    		done();
    	});
    });

    it('deleteById -> wrong id', (done) => {
    	UtilService.deleteById('bla').catch((error) => {
			expect(error).to.have.property('name').to.be.equal('CastError');

			done();
		});
    });

    it('deleteById', (done) => {
    	UtilService.deleteById(userId).then((result) => {
    		expect(result).to.have.property('deletedCount').and.to.be.equal(1);
    		expect(result).to.have.property('ok').and.to.be.equal(1);

    		done();
    	});
    });
});