"use strict";
const async = require("async");
module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define("Organization", {
        name: { type: DataTypes.STRING, allowNull: false },
        description: DataTypes.TEXT,
        address: DataTypes.TEXT,
        phone_number: DataTypes.STRING,
        access: { type: DataTypes.INTEGER, allowNull: false }, // 0: public, 1: closed, 2: secret
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        website: DataTypes.TEXT,
        ip_address: { type: DataTypes.STRING, allowNull: false },
        user_agent: { type: DataTypes.TEXT, allowNull: false },
        weight: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
        theme_id: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        indexes: [
            {
                name: 'organizations_idx_id_deleted',
                fields: ['id', 'deleted']
            },
            {
                name: 'organizations_idx_deleted',
                fields: ['deleted']
            }
        ],
        tableName: 'organizations',
    });
    Organization.associate = (models) => {
        Organization.belongsTo(models.Domain, { foreignKey: 'domain_id' });
        Organization.belongsTo(models.Community, { foreignKey: 'community_id' });
        Organization.belongsTo(models.User, { foreignKey: 'user_id' });
        Organization.belongsToMany(models.Image, { as: 'OrgLogoImgs', through: 'OrganizationLogoImage' });
        Organization.belongsToMany(models.Image, { as: 'OrganizationHeaderImages', through: 'OrganizationHeaderImage' });
        Organization.belongsToMany(models.User, { as: 'OrganizationUsers', through: 'OrganizationUser' });
        Organization.belongsToMany(models.User, { as: 'OrganizationAdmins', through: 'OrganizationAdmin' });
    };
    Organization.ACCESS_PUBLIC = 0;
    Organization.ACCESS_CLOSED = 1;
    Organization.ACCESS_SECRET = 2;
    Organization.convertAccessFromRadioButtons = (body) => {
        let access = 0;
        if (body.public) {
            access = 0;
        }
        else if (body.closed) {
            access = 1;
        }
        else if (body.secret) {
            access = 2;
        }
        return access;
    };
    Organization.prototype.simple = function () {
        return { id: this.id, name: this.name, hostname: this.hostname };
    };
    Organization.prototype.updateAllExternalCounters = function (req, direction, column, done) {
        if (direction === 'up')
            req.ypDomain.increment(column);
        else if (direction === 'down')
            req.ypDomain.decrement(column);
        done();
    };
    Organization.prototype.setupLogoImage = function (body, done) {
        if (body.uploadedLogoImageId) {
            sequelize.models.Image.findOne({
                where: { id: body.uploadedLogoImageId }
            }).then((image) => {
                if (image)
                    this.addOrganizationLogoImage(image);
                done();
            });
        }
        else
            done();
    };
    Organization.prototype.setupHeaderImage = function (body, done) {
        if (body.uploadedHeaderImageId) {
            sequelize.models.Image.findOne({
                where: { id: body.uploadedHeaderImageId }
            }).then((image) => {
                if (image)
                    this.addOrganizationHeaderImage(image);
                done();
            });
        }
        else
            done();
    };
    Organization.prototype.setupImages = function (body, done) {
        async.parallel([
            (callback) => {
                this.setupLogoImage(body, (err) => {
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
    return Organization;
};
