package com.dotcms.variant.business;

import com.dotcms.variant.model.Variant;
import com.dotmarketing.business.Cachable;

/**
 * Cache for {@link Variant}
 */
public interface VariantCache extends Cachable {

    /**
     * Add a {@link Variant} into the cache.
     * @param variant
     */
    void put(final Variant variant);

    /**
     * Get a {@link Variant} from cache by Id.
     *
     * @param id
     * @return
     */
    Variant getById(final String id);

    /**
     * Get a {@link Variant} from cache by name.
     *
     * @param name
     * @return
     */
    Variant getByName(final String name);

    /**
     * Remove a {@link Variant} from cache.
     *
     * @param variant
     * @return
     */
    void remove(final Variant variant);
}
