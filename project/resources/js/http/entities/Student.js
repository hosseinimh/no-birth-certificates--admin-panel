import { STUDENTS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Student extends Entity {
    constructor() {
        super();
    }

    async getPagination(name, _pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_STUDENTS, {
            name,
            _pn,
            _pi,
        });
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_STUDENT + "/" + id);
    }

    async store(name, family, address, phone, date, image) {
        let data = new FormData();

        data.append("name", name);
        data.append("family", family);
        data.append("address", address);
        data.append("phone", phone);
        data.append("date", date);
        data.append("image", image);

        return await this.handlePost(API_URLS.STORE_STUDENT, data);
    }

    async update(id, name, family, address, phone, date, image) {
        let data = new FormData();

        data.append("name", name);
        data.append("family", family);
        data.append("address", address);
        data.append("phone", phone);
        data.append("date", date);
        data.append("image", image);

        return await this.handlePost(API_URLS.UPDATE_STUDENT + "/" + id, data);
    }

    async remove(id) {
        return await this.handlePost(API_URLS.REMOVE_STUDENT + "/" + id);
    }
}
