package com.dotcms.contenttype.model.field;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableSelectField.class)
@JsonDeserialize(as = ImmutableSelectField.class)
public abstract class SelectField extends Field {

    @Value.Default
    @Override
    public DataTypes dataType(){
        return DataTypes.TEXT;
    };

}
