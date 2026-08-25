'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StoreProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      defaultProfile: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn('Products', 'storeProfileId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'StoreProfiles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Categories', 'storeProfileId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'StoreProfiles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    const now = new Date();
    const [profiles] = await queryInterface.sequelize.query(
      `SELECT id FROM StoreProfiles LIMIT 1`
    );
    let defaultProfileId = null;
    if (profiles.length === 0) {
      const [result] = await queryInterface.sequelize.query(
        `INSERT INTO StoreProfiles (name, slug, description, active, defaultProfile, createdAt, updatedAt)
         VALUES ('Supermarket', 'supermarket', 'Default supermarket profile', 1, 1, '${now.toISOString()}', '${now.toISOString()}')`
      );
      defaultProfileId = result;
    } else {
      defaultProfileId = profiles[0].id;
    }

    if (defaultProfileId) {
      await queryInterface.sequelize.query(
        `UPDATE Products SET storeProfileId = ${defaultProfileId} WHERE storeProfileId IS NULL`
      );
      await queryInterface.sequelize.query(
        `UPDATE Categories SET storeProfileId = ${defaultProfileId} WHERE storeProfileId IS NULL`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Categories', 'storeProfileId');
    await queryInterface.removeColumn('Products', 'storeProfileId');
    await queryInterface.dropTable('StoreProfiles');
  },
};
