package com.dotcms.variant;

import com.dotcms.variant.model.Variant;
import com.dotmarketing.exception.DotDataException;
import java.util.Optional;

/**
 * Factory for {@link Variant}
 */
public interface VariantFactory {

    /**
     * Save a new {@link Variant}.
     * if the the {@link Variant}'s identifier value is not null then it will be ignored.
     * Also, if {@link Variant}'s deleted value is true then it will be ignored.
     *
     * @param variant
     *
     * @throws NullPointerException if the {@link Variant}'s name is null
     */

    Variant save(final Variant variant) throws DotDataException;

    /**
     * Update a {@link Variant}, the {@link Variant}'s identifier should not be null or a
     * {@link NullPointerException} will throw.
     *
     * @param variant
     *
     * @throws NullPointerException if the {@link Variant}'s identifier is null or
     *                              if {@link Variant}'s name is null
     */
    void update(final Variant variant) throws DotDataException;

    /**
     * Delete a {@link Variant}
     *
     * @param id Variant's id to be deleted
     */
    void delete(final String id) throws DotDataException;

    /**
     * Return a {@link Variant} by Identifier
     * @param identifier {@link Variant}'s identifier
     * @return {@link Variant}
     */
    Optional<Variant> get(final String identifier) throws DotDataException;

    /**
     * Return a {@link Variant} by Name
     * @param name {@link Variant}'s name
     * @return {@link Variant}
     */
    Optional<Variant> getByName(final String name) throws DotDataException;

}
