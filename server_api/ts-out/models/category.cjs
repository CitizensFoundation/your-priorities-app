"use strict";
const async = require("async");
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        icon_file_name: DataTypes.STRING,
        language: { type: DataTypes.STRING, allowNull: true }
    }, {
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'categories',
        defaultScope: {
            where: {
                deleted: false
            }
        },
        indexes: [
            {
                fields: ['id', 'deleted']
            },
            {
                fields: ['name', 'deleted']
            },
            {
                name: 'categories_idx_deleted_group_id',
                fields: ['deleted', 'group_id']
            },
            {
                name: 'categories_idx_deleted',
                fields: ['deleted']
            }
        ],
        timestamps: true,
    });
    Category.associate = (models) => {
        Category.hasMany(models.Post);
        Category.belongsTo(models.Group, { foreignKey: 'group_id' });
        Category.belongsToMany(models.Image, {
            as: 'CategoryIconImages',
            through: 'CategoryIconImage'
        });
        Category.belongsToMany(models.Image, { as: 'CategoryHeaderImages', through: 'CategoryHeaderImage' });
    };
    Category.prototype.setupIconImage = function (body, done) {
        if (body.uploadedIconImageId) {
            sequelize.models.Image.findOne({
                where: { id: body.uploadedIconImageId }
            }).then((image) => {
                if (image)
                    this.addCategoryIconImage(image);
                done();
            });
        }
        else
            done();
    };
    Category.prototype.setupHeaderImage = function (body, done) {
        if (body.uploadedHeaderImageId) {
            sequelize.models.Image.findOne({
                where: { id: body.uploadedHeaderImageId }
            }).then((image) => {
                if (image)
                    this.addCategoryHeaderImage(image);
                done();
            });
        }
        else
            done();
    };
    Category.prototype.setupImages = function (body, done) {
        async.parallel([
            (callback) => {
                this.setupIconImage(body, (err) => {
                    if (err)
                        return callback(err);
                    callback();
                });
            },
            (callback) => {
                this.setupHeaderImage(body, (err) => {
                    if (err)
                        return callback(err);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });
    };
    return Category;
};
