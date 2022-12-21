import App from "../../app";
import { EstablishmentController } from "../../controllers/establishment.controller";

describe('The EsablishmentController', () => {

    let app:App;
	let establishmentController:EstablishmentController;

    beforeEach(async () => {

		establishmentController = new EstablishmentController();
		app = new App([establishmentController]);
	});

	describe('GET /establishments. Get all establishments', () => {

	});
	describe('POST /establishments. Create a new establishment', () => {

	});

	describe('GET /establishments/:id. Get establishment by ID', () => {

	});

	describe('PUT /establishments/:id. Update establishment by ID', () => {

	});

	describe('DELETE /establishments/:id. Delete establishment by ID', () => {

	});

	

});