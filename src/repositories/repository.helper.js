import BaseRepository from './base.repository.js';

export const createRepository = (model) => {
    return new BaseRepository(model);
};

// Repository factory with getRepository method
export const repositoryFactory = {
    getRepository: (model) => {
        return new BaseRepository(model);
    }
};

export { BaseRepository };