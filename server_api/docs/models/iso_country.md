# Model: IsoCountry

Represents an ISO country entity in the database, storing the country code and its English name. This model is mapped to the `tr8n_iso_countries` table and uses underscored column naming conventions. It is associated with the `Group` model, where one country can have many groups.

## Properties

| Name                | Type   | Description                                 |
|---------------------|--------|---------------------------------------------|
| code                | string | The ISO country code (e.g., "US", "DE").    |
| country_english_name| string | The English name of the country.            |
| created_at          | Date   | Timestamp when the record was created.      |
| updated_at          | Date   | Timestamp when the record was last updated. |

## Table Configuration

- **Table Name:** `tr8n_iso_countries`
- **Timestamps:** Uses `created_at` and `updated_at` fields for creation and update times.
- **Naming Convention:** Uses underscored column names.

## Associations

| Association Type | Target Model | Foreign Key      | Description                                      |
|------------------|--------------|------------------|--------------------------------------------------|
| hasMany          | Group        | iso_country_id   | One country can have many associated groups.      |

## Example

```javascript
// Example: Creating a new IsoCountry
const IsoCountry = sequelize.models.IsoCountry;
await IsoCountry.create({
  code: "US",
  country_english_name: "United States"
});
```

## Sequelize Model Definition

```javascript
sequelize.define("IsoCountry", {
  code: DataTypes.STRING,
  country_english_name: DataTypes.STRING
}, {
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'tr8n_iso_countries'
});
```

## Association Definition

```javascript
IsoCountry.associate = (models) => {
  IsoCountry.hasMany(models.Group, {foreignKey: "iso_country_id"});
};
```

---

**See also:**  
- [Group](./Group.md) (for the associated model)