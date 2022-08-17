import { RELATIVES_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Relative extends Entity {
    constructor() {
        super();
    }

    async getPagination(studentId, name, _pn = 1, _pi = 10) {
        return await this.handlePost(
            API_URLS.FETCH_RELATIVES + "/" + studentId,
            {
                name,
                _pn,
                _pi,
            }
        );
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_RELATIVE + "/" + id);
    }

    async store(studentId, name, family, date, relation, relationText, image) {
        let data = new FormData();

        data.append("name", name);
        data.append("family", family);
        data.append("date", date);
        data.append("relation", relation);
        data.append("relation_text", relationText);
        data.append("image", image);

        return await this.handlePost(
            API_URLS.STORE_RELATIVE + "/" + studentId,
            data
        );
    }

    async update(id, name, family, date, relation, relationText, image) {
        let data = new FormData();

        data.append("name", name);
        data.append("family", family);
        data.append("date", date);
        data.append("relation", relation);
        data.append("relation_text", relationText);
        data.append("image", image);

        return await this.handlePost(API_URLS.UPDATE_RELATIVE + "/" + id, data);
    }

    async remove(id) {
        return await this.handlePost(API_URLS.REMOVE_RELATIVE + "/" + id);
    }
}
