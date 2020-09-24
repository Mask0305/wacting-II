export async function up(queryInterface, Sequelize) {
	/**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
	return queryInterface.bulkInsert('Examples', [{
		name: 'bububu',
		createdAt: new Date(),
		updatedAt: new Date(),
	}]);
}

export async function down(queryInterface, Sequelize) {
	/**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
        */
	return queryInterface.bulkDelete('Examples', null, {});
}